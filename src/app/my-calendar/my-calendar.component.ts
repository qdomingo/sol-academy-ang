import { Component , signal, ChangeDetectorRef } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput, CalendarApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { createEventId } from './event-utils';
import { OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { Select } from 'primeng/select';
import { Checkbox } from 'primeng/checkbox';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { ScheduleService } from '../services/schedule.service';
import { StudentService } from '../services/student.service';
import { Schedule } from '../models/schedule.model';
import { Student } from '../models/student.model';
import { MyTask } from '../models/task.model';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-my-calendar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FullCalendarModule, AsyncPipe, InputTextModule,
    ButtonModule, DialogModule, ConfirmDialogModule, FormsModule, TextareaModule, TagModule,
    Select, Checkbox, TooltipModule],
  providers: [ConfirmationService],
  templateUrl: './my-calendar.component.html',
  styleUrl: './my-calendar.component.css'
})
export class MyCalendarComponent implements OnInit {

  infoVisible = false;
  newScheduleVisible = false;
  modifyScheduleVisible = false;
  modifyScheduleTimeVisible = false;
  deleteScheduleVisible = false;
  actionScheduleVisible = false;
  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    events: undefined,
    weekends: false,
    firstDay: 1,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    timeZone:'local',
    slotMinTime: '08:00:00', // Establecer la hora mínima a las 08:00
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    // you can update a remote database when these fire:
    eventChange: this.handleEventChange.bind(this),
    // eventRemove: this.handleEventRemove.bind(this),
    eventAdd: this.handleEventAdd.bind(this)

  });
  currentEvents = signal<EventApi[]>([]);
  listShcedule: Schedule[] = [];
  FETCH_EVENTS: EventInput[] = [];
  studentList: Student[] = [];
  selectedStudent: Student | undefined;
  titleSchedule: string = '';
  calendarApi2: CalendarApi | undefined;
  selectInfo2: DateSelectArg | undefined;
  weeklyChecked: boolean = false;
  deleteWeeklyChecked: boolean = false;
  modifyWeeklyChecked: boolean = false;
  scheduleSelected: Schedule | undefined;
  scheduleToDelete: Schedule | undefined;
  scheduleToModify: Schedule | undefined;

  titleTask: string = '';
  descriptionTask: string = '';
  newTaskVisible = false;

  constructor(private changeDetector: ChangeDetectorRef, private scheduleService: ScheduleService,
    private studentService: StudentService, private confirmationService: ConfirmationService,
  private router: Router) {
  }

  ngOnInit() {
    // this.loadScheduleList();
    this.loadStudentList();
  }

  // Cargas Iniciales

  loadStudentList() {
    this.studentService.getStudentList().subscribe((data) => {
      this.studentList = data;
      this.loadScheduleList(); // se llama aquí pues necesitamos que los estudiantes ya estén cargados
    });
  }

  loadScheduleList() {
    this.scheduleService.getScheduleList().subscribe((data) => {
      this.listShcedule = data;
      this.FETCH_EVENTS = this.listShcedule.map((schedule) => {
        // logica para colorear los eventos
        let scheduleColor = '#f7dc6f';
        let scheduleBorderColor = 'yellow'
        if(this.studentList) {
          this.studentList.filter((student) => {
            if(student.id === schedule.student_id) {
              if(student.nickname === 'Preply') {
                if (schedule.weekly === 0) {
                  scheduleColor = '#5dade2'
                  scheduleBorderColor = 'blue'
                } else {
                  scheduleColor = '#FF7AAC'
                  scheduleBorderColor = 'pink'
                }
              }
              if(student.nickname === 'Googlemeet') {
                if (schedule.weekly === 0) {
                  scheduleColor = '#006633'
                  scheduleBorderColor = 'green'
                } else {
                  scheduleColor = '#58d68d'
                  scheduleBorderColor = 'green'
                }
              }
            }
          })
        }

        // logica para extraer valores de las tasks
        let title = '';
        let description = '';
        let confirmed = 0;
        if(schedule.task_id) {
          this.studentList.filter((student) => {
            if(student.id === schedule.student_id) {
              if(student.tasks) {
                student.tasks.filter((task) => {
                  if(task.schedule_id === schedule.id) {
                    title = task.title;
                    description = task.description;
                    confirmed = task.confirmed;
                  }
                });
              }
            }
          });
        }
        // mapear resultados
        return {
          id: String(schedule.id),
          title: schedule.title,
          start: schedule.inicio,
          end: schedule.fin,
          color: scheduleColor,
          borderColor: scheduleBorderColor,
          weekly: schedule.weekly,
          // serie_id: schedule.serie_id,
          // task_id: schedule.task_id,
          // outdated: schedule.outdated
          extendedProps: {
            // weekly: schedule.weekly,
            serie_id: schedule.serie_id,
            task_id: schedule.task_id,
            task_title: title,
            task_description: description,
            task_confirmed: confirmed,
            outdated: schedule.outdated
          }
        }
      });
      console.log(this.FETCH_EVENTS);
      this.calendarOptions.update(() => ({events: this.FETCH_EVENTS}));
    });
  }

  // Evento toogle semanas

  handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  // Evento seleccionar fecha

  handleDateSelect(selectInfo: DateSelectArg) {

    this.calendarApi2 = selectInfo.view.calendar;
    this.selectInfo2 = selectInfo;
    // calendarApi.unselect(); // clear date selection
    this.newScheduleVisible = true;

  }

  handleEventAdd(event: any) {

    const newEvent = {
      id: createEventId(),
      title: event.event.title,
      start: new Date(event.event.start).toISOString(),
      end: new Date(event.event.end).toISOString(),
      student_id: 0,
      weekly: 0
    };
    if(this.selectedStudent !== undefined) {
      newEvent.student_id = this.selectedStudent.id;
    }
    if(this.weeklyChecked) {
      newEvent.weekly = 1;
    }

    // clear the form
    this.titleSchedule = '';
    this.selectedStudent = undefined;

    this.scheduleService.addSchedule(newEvent).subscribe((response) => {
      console.log('Event added from database', response);
      this.loadScheduleList();
    }, (error) => {
      console.error('Error adding event from database', error);
    });
  }

  handleEventClick(clickInfo: EventClickArg) {

    // this.deleteScheduleVisible = true;
    this.scheduleSelected = undefined; // limpiamos por si estaba seleccionado
    this.actionScheduleVisible = true
    this.listShcedule.filter((schedule) => {
      if(String(schedule.id) === clickInfo.event.id) {
        this.scheduleSelected = schedule;
      }
    });
  
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

  handleEventChange(event: any) {

    this.listShcedule.filter((schedule) => {
      if(String(schedule.id) === event.event.id) {
        this.scheduleToModify = schedule;
        this.scheduleToModify.inicio = new Date(event.event.start).toISOString();
        this.scheduleToModify.fin = new Date(event.event.end).toISOString();
      }
    });

    // const eventInput: EventInput = {
    //   id: event.event.id,
    //   title: event.event.title,
    //   start: new Date(event.event.start).toISOString(),
    //   end: new Date(event.event.end).toISOString(),
    // };

    // Si weekly = 1, entonces debemos preguntar si se quiere modificar la serie
    // Si weekly = 0, entonces modificamos el evento
    if(this.scheduleToModify && this.scheduleToModify.weekly === 1) {
      this.modifyScheduleTimeVisible = true;
    } else if(this.scheduleToModify) {
      this.modifyOneSchedule();
    }

  }

  ////////////////// ACCIONES POP UP EVENTO CREAR SCHEDULE //////////////////

  saveSchedule() {

    if (this.titleSchedule && this.selectInfo2 && this.calendarApi2) {
      // Create event
      const newEvent = {
        id: createEventId(),
        title: this.titleSchedule,
        start: this.selectInfo2.startStr,
        end: this.selectInfo2.endStr,
        allDay: this.selectInfo2.allDay
      };
      // Add event to calendar
      this.calendarApi2.addEvent(newEvent);
    }

    this.newScheduleVisible = false;
  }

  onChangeSelectButton() {
    if(this.selectedStudent) {
      this.titleSchedule = this.selectedStudent.name + ' - ' + this.selectedStudent.nickname 
    }
  }

  ////////////////// BOTONES DE ACCIONES POP UP INICIAL //////////////////

  onClickActionDelete() {
    console.log(this.scheduleSelected);
    this.deleteScheduleVisible = true;
    this.scheduleToDelete = this.scheduleSelected;
    // this.scheduleSelected = this.scheduleToDelete;
    this.actionScheduleVisible = false;
  }

  onClickActionAddTask() {
    console.log(this.scheduleSelected);
    // si ya hay task asociada con ese schedule ponemos titulo y descripcion
    if(this.scheduleSelected && this.scheduleSelected.task_id) {
      const schedule = this.scheduleSelected;
        this.studentList.filter((student) => {
          if(student.id === schedule.student_id) {
            if(student.tasks) {
              student.tasks.filter((task) => {
                if(task.schedule_id === schedule.id) {
                  this.titleTask = task.title;
                  this.descriptionTask = task.description
                }
              });
            }
          }
        });
    }
    this.newTaskVisible = true;
    this.actionScheduleVisible = false;
  }

  onClickActionGoToStudent() {
    this.router.navigateByUrl('/studentTasks/' + this.scheduleSelected?.student_id);
    this.newTaskVisible = false;
  }

  onClickActionGoToPayment() {
    this.router.navigateByUrl('/studentPayments/' + this.scheduleSelected?.student_id);
    this.newTaskVisible = false;
  }

  onClickActionModifySchedule() {
    this.modifyScheduleVisible = true;
    this.scheduleToModify = this.scheduleSelected;
    this.titleSchedule = this.scheduleToModify!.title;
    this.actionScheduleVisible = false;
  }

  ////////////////// BOTON DE ACCION POP UP DELETE //////////////////

  onClickDelete() {
    if (this.scheduleToDelete && this.scheduleToDelete.weekly === 1 && this.deleteWeeklyChecked) {
      this.deleteScheduleSerie(this.scheduleToDelete);
    } else if (this.scheduleToDelete) {
      this.deleteOneSchedule(this.scheduleToDelete);
    }

    this.deleteScheduleVisible = false;
    this.deleteWeeklyChecked = false;
    this.scheduleToDelete = undefined;
  }

  ////////////////// BOTON DE ACCION POP UP MODIFY //////////////////

  onClickModifyScheduleTime() {
    if (this.scheduleToModify && this.scheduleToModify.weekly === 1 && this.modifyWeeklyChecked) {
      this.modifyScheduleSerie();
    } else if (this.scheduleToModify) {
      this.modifyOneSchedule();
    }

    this.modifyScheduleTimeVisible = false;
    this.scheduleToModify = undefined;
    this.modifyWeeklyChecked = false;
  }

  ////////////////// BOTON DE ACCION POP UP MODIFY TITLE //////////////////

  modifyScheduleTitle() {

    this.scheduleToModify!.title = this.titleSchedule;

    if (this.scheduleToModify && this.scheduleToModify.weekly === 1 && this.modifyWeeklyChecked) {
      this.modifyScheduleSerie();
    } else if (this.scheduleToModify) {
      this.modifyOneSchedule();
    }
    this.scheduleToModify = undefined;
    this.modifyWeeklyChecked = false;
    this.modifyScheduleVisible = false;
    this.titleSchedule = '';
    
  }

  ////////////////// LLAMADAS A SERVICIOS //////////////////

  modifyOneSchedule() {
    this.scheduleService.updateSchedule(this.scheduleToModify).subscribe((response) => {
      console.log('Event updated in database', response);
      this.loadScheduleList();
      this.scheduleToModify = undefined;
    }, (error) => {
      console.error('Error updating event in database', error);
      this.scheduleToModify = undefined;
    });
  }

  modifyScheduleSerie() {
    this.scheduleService.updateScheduleSerie(this.scheduleToModify).subscribe((response) => {
      console.log('Event updated in database', response);
      this.loadScheduleList();
      this.scheduleToModify = undefined;
    }, (error) => {
      console.error('Error updating event in database', error);
      this.scheduleToModify = undefined;
    });
  }

  deleteOneSchedule(schedule: Schedule) {
    this.scheduleService.deleteSchedule(schedule.id).subscribe((response) => {
      console.log('Event deleted from database', response);
      this.loadScheduleList();
      this.scheduleToDelete = undefined;
    }, (error) => {
      console.error('Error deleting event from database', error);
      this.scheduleToDelete = undefined;
    });
  }

  deleteScheduleSerie(schedule: Schedule) {
    this.scheduleService.deleteScheduleSerie(schedule).subscribe((response) => {
      console.log('Event deleted from database', response);
      this.loadScheduleList();
      this.scheduleToDelete = undefined;
    }, (error) => {
      console.error('Error deleting event from database', error);
      this.scheduleToDelete = undefined;
    });
  }

  saveTask(){
    if(this.titleTask && this.descriptionTask && this.scheduleSelected && this.scheduleSelected.student_id) {
      const task: MyTask = {
        id: 0,
        title: this.titleTask,
        description: this.descriptionTask,
        student_id: this.scheduleSelected.student_id,
        confirmed: 0,
        schedule_id: this.scheduleSelected.id
      }
      // si task ya existe se actauliza, si no existe se crea
      if (this.scheduleSelected && this.scheduleSelected.task_id) {
        task.id = this.scheduleSelected.task_id;
        this.studentService.updateTask(task).subscribe((response) => {
          console.log('Event created in database', response);
          this.loadStudentList();
        }, (error) => {
          console.error('Error creating event in database', error);
        });
      }
      else {
        this.studentService.createTask(task).subscribe((response) => {
          console.log('Event created in database', response);
          this.loadStudentList();
        }, (error) => {
          console.error('Error creating event in database', error);
        });
      }
    }
    this.newTaskVisible = false;
  }

  ////////////////// ONHIDE //////////////////

  onHide() {
    this.newScheduleVisible = false;
    // clear the form
    this.titleSchedule = '';
    this.selectedStudent = undefined;
    this.weeklyChecked = false;

    // clear the selection
    if (this.calendarApi2) {
       this.calendarApi2.unselect();
    }
  }

  onHide1() {
    this.modifyScheduleTimeVisible = false;
    this.scheduleToModify = undefined;
    this.modifyWeeklyChecked = false;
    this.loadScheduleList();
  }

  onHide2() {
    this.deleteScheduleVisible = false;
    this.scheduleToDelete = undefined;
    this.deleteWeeklyChecked = false;
  }

  onHide3() {
    this.actionScheduleVisible = false;
    // this.scheduleSelected = undefined;
  }

  onHide4() {
    this.newTaskVisible = false;
    this.titleTask = '';
    this.descriptionTask = '';
    this.scheduleSelected = undefined;
  }

  onHide5() {
    this.modifyScheduleVisible = false;
    this.scheduleSelected = undefined;
    this.titleSchedule = '';
  }

}
