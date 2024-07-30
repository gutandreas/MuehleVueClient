
<template>
  <div>
    <input v-model="sendMessage" placeholder="Type a message"/>
    <button @click="send">Send</button>
    <div v-for="message in receivedMessages" :key="message">{{ message }}</div>
  </div>
</template>

<script>
import stompService from '../stomp/stompService';


export default {
  name: 'WebSocketComponent',
  data() {
    return {
      sendMessage: '',
      receivedMessages: []
    };
  },
  methods: {
    send() {
      console.log("Sending message: " + this.sendMessage);
      stompService.send('/app/hello', { name: this.sendMessage });
    }
  },
  created() {
    stompService.subscribe('/topic/greetings', (message) => {
      this.receivedMessages.push(JSON.parse(message.body).content);
    });
  },
  unmounted() {
    stompService.unsubscribe('/topic/greetings');
  }
};
</script>
