<template>
    <v-container>
     
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat color="white">
            <template>
              <!---- Dialog Start----->
              <v-dialog
                max-width="350px"
                v-model="dialog"
              >
                <template v-slot:activator="{ on }">
                  <v-btn class="mx-2" fab dark small color="accent" v-on="on">
                    <v-icon dark>mdi-plus</v-icon>
                  </v-btn>
                </template>
                
                <v-card>
                  <v-container>
                    <v-card-title>
                      <span class="headline">イベントを作成</span>
                    </v-card-title>
                    <v-form @submit.prevent="newEvent">
                      <v-text-field
                        v-model="name"
                        type="text"
                        label="イベント名"
                      >
                      </v-text-field>
                      <v-text-field
                        v-model="details"
                        type="text"
                        label="詳細"
                      ></v-text-field>
                      <v-text-field
                        v-model="start"
                        type="date"
                        label="開始時間"
                      ></v-text-field>
                      <v-text-field
                        v-model="end"
                        type="date"
                        label="終了時間"
                      ></v-text-field>
                      <v-text-field
                        v-model="color"
                        type="color"
                        label="カラー"
                      >
                      </v-text-field>
                      <v-btn
                       type="submit" 
                       color="accent" 
                       @click.stop="dialog = false"
                       class="mr-4"
                       >イベントの作成</v-btn>
                    </v-form>
                  </v-container>
                </v-card>
              </v-dialog>
              <!---- Dialog END----->
            </template>
          <v-btn small class="ml-4 primary" @click="setToday">
             today
          </v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <!--- 時計 ----->
          <div class="timer">
            {{ hour}}:{{minutes}}
          </div>
          <!--- Menu ---->
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn
                class="primary"
                small
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      {{ today }}
      <v-sheet height="550">
        <v-calendar
        ref="calendar"
        v-model="focus"
        color="light-blue darken-1"
        :events="events"
        :event-color="getEventColor"
        :event-margin-bottom="3"
        locale="ja-jp"
        :now="today"
        :day-format="timestamp => new Date(timestamp.date).getDate()"
        :month-format="timestamp => (new Date(timestamp.date).getMonth() + 1 ) + '/'"
        :type="type"
        @click:event="showEvent"
        @click:date="viewDay"
        @click:more="viewDay"
         @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-btn icon>
                <v-icon @click="deleteEvent(selectedEvent.id)">mdi-delete</v-icon>
              </v-btn>         
              <v-toolbar-title v-html="selectedEvent.name ">
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
            </v-toolbar>
            
            <v-card-text>
              <form v-if="currentlyEditing !== selectedEvent.id">
                {{ selectedEvent.details}}
              </form>
              <form v-else>
                 <textarea-autosize
                  type="text"
                  style="width: 100%"
                  :min-height="100"
                  aria-placeholder="スケジュールを追加する"
                  v-model="selectedEvent.details"
                  >
                </textarea-autosize>
              </form>
            </v-card-text>
            
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                閉じる
              </v-btn>
              
              <v-btn
                text 
                color="secondary"
                 v-if="currentlyEditing !== selectedEvent.id"
                @click.prevent="editEvent(selectedEvent)"
                
              >編集</v-btn>
              <v-btn
                v-else
                text
                color="secondary"
                @click.prevent="updateEvent(selectedEvent)"
              >
                保存する
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
  </v-container>

  
</template>

<script>
import { db } from '@/main'
// import firebase from 'firebase'
import moment from 'moment'

export default {
  components: {},
  data() {
    return {
      textColor: 'black',
      today:null,
      focus:null,
      time: null,
      intervalTime: null,
      type: 'month',
      color: '#42cef5',
      start: null,
      end: null,
      name: null,
      details: null,
      dialog: false,
      events: [],
      locale: moment.locale('ja'),
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      currentlyEditing: null,
      typeToLabel:
        {
          month: 'Month',
          week: 'Week',
          date: 'Date',
          day: 'Day',
        },
        uid: null
    }
  },
  mounted() {
    this.setTime()
    //コメントオフでYYYY-MM-ddのwarnが消えた
    //this.$refs.calendar.checkChange()
    this.getEvents()
  },
  computed: {
    title() {
      const { start, end } = this
        if (!start || !end) {
          return ''
        }

        const startMonth = this.monthFormatter(start)
        const endMonth = this.monthFormatter(end)
        const suffixMonth = startMonth === endMonth ? '' : endMonth

        const startYear = start.year
        const endYear = end.year
        const suffixYear = startYear === endYear ? '' : endYear

        const startDay = start.day + this.dateNumber(start.day)
        const endDay = end.day + this.dateNumber(end.day)
        switch (this.type) {
          case 'month':
            return `${startMonth} ${startYear}年`
          case 'week':
             return `${startMonth} ${startDay} - ${suffixMonth} ${endDay} ${startYear}年  ${suffixYear} `
          case 'day':
            return `${startMonth} ${startDay} ${startYear}年`
        }
      return ''
    },
      monthFormatter () {
        return this.$refs.calendar.getFormatter({
          timeZone: 'UTC', month: 'long',
        })
      },
      hour() {
        return moment(this.time).format('HH')
      },
      minutes() {
        return moment(this.time).format('mm')
      },
      seconds() {
        return moment(this.time).format('ss')
      }
  },
  beforeDestroy() {
    clearInterval(this.intervalTime)
  },
  methods: {
    setTime() {
        this.intervalTime = setInterval(() => {
        this.time = moment(new Date())
      }, 100)
    },
    async getEvents() {
      let snapshot = await db.collection('calEvent').get()
      let events = []
      snapshot.forEach(doc => {
        let appData = doc.data()
        appData.id = doc.id
        events.push(appData)
      })
      this.events = events
    },
    getEventColor(ev) {
      return ev.color
    },
    async updateEvent(ev) {
        await db.collection('calEvent')
        .doc(this.currentlyEditing)
        .update({
          name: ev.name,
          details: ev.details
        })
        this.selectedOpen = false
        this.getEvents()
      },
      async deleteEvent(ev) {
        await db.collection('calEvent')
        .doc(ev)
        .delete()
        this.selectedOpen = false
        this.getEvents()
      },
      async newEvent() {
        if (this.name && this.start && this.end) {
          await db.collection('calEvent')
        .add({
          name: this.name,
          details: this.details,
          start: this.start,
          end: this.end,
          color: this.color
        })
        this.getEvents()
        this.name='',
        this.details='',
        this.start='',
        this.end='',
        this.color='#42cef5'
        } else {
          alert('イベントを作成して下さい')
        } 
      },
    editEvent(event) {
        this.currentlyEditing = event.id
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => this.selectedOpen = true, 10)
      }
        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }
        nativeEvent.stopPropagation()
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    setToday() {
      this.focus = this.today
    },
    viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
    },
    updateRange ({ start, end }) {
        // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
      this.start = start
      this.end = end
    },
    dateNumber() {
        return '日'
    },
  }
}
</script>

<style scoped>
.timer {
  margin-right: 20px;
}

</style>

