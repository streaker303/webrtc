<template>
  <div class="container">
    <h2>学生页面</h2>
    <div class="content ub ub-pj">
      <div class="ub ub-ver">
        MY
        <video src="" id="rtcA" muted controls autoplay></video>
      </div>
      <div class="ub ub-ver">
        Remote-teacher
        <video src="" id="rtcB" muted controls autoplay></video>
      </div>
    </div>
  </div>
</template>

<script>
import socket from '../utils/socket'

export default {
  name: "student",
  data() {
    return {
      peer: null,
      localstream: '',
      iceServers: {
        "iceServers": [
          {"url": "stun:stun.l.google.com:19302"},
          {"url": "stun:119.29.157.161:3478"},
          {"url": "turn:119.29.157.161:3478", "credential": "123456", "username": "admin"}
        ]
      },
      offerOption: {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
      }
    }
  },
  mounted() {
    this.createMedia()
  },
  methods: {
    async createMedia(data) {
      // 保存本地流到全局
      try {
        this.localstream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
        let video = document.querySelector('#rtcA');
        video.srcObject = this.localstream;
      } catch (e) {
        console.log('getUserMedia: ', e)
      }
      this.initPeer(data); // 获取到媒体流后，调用函数初始化 RTCPeerConnection
    },

    async onOffer(data) { // 接收offer并发送 answer
      try {
        // 接收端设置远程 offer 描述
        await this.peer.setRemoteDescription(data.sdp);
        // 接收端创建 answer
        let answer = await this.peer.createAnswer();
        // 接收端设置本地 answer 描述
        await this.peer.setLocalDescription(answer);
        // 给对方发送 answer
        socket.emit('Server-Answer', {from: 'student', to: 'teacher', sdp: answer});
      } catch (e) {
        console.log('onOffer: ', e);
      }
    },

    async onIce(data) { // 接收 ICE 候选
      if (data.from === 'student') return
      try {
        await this.peer.addIceCandidate(data.candidate); // 设置远程 ICE
      } catch (e) {
        console.log('onAnswer: ', e);
      }
    },

    initPeer() {
      // 创建输出端 PeerConnection
      let PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
      this.peer = new PeerConnection(this.iceServers);
      for (const track of this.localstream.getTracks()) {
        this.peer.addTrack(track, this.localstream);
      }
      // 监听ICE候选信息 如果收集到，就发送给对方
      this.peer.onicecandidate = (event) => {
        console.log('生成学生candidate')
        if (event.candidate) {
          socket.emit('Server-ICE', {from: 'student', to: 'teacher', candidate: event.candidate});
        }
      };
      this.peer.ontrack = (event) => { // 监听是否有媒体流接入，如果有就赋值给 rtcB 的 src
        console.log('学生获取新增流', event)
        let video = document.querySelector('#rtcB');
        video.srcObject = event.streams[0];
      };
      socket.on('Client-Offer', data => this.onOffer(data))
      socket.on('Client-ICE', data => this.onIce(data))
    },
  },
}
</script>

<style scoped>
.content {
  width: 100%;
  height: 500px;
  border: 2px solid greenyellow;
}

video {
  width: 400px;
  height: 400px;
}
</style>
