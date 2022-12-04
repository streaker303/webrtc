<template>
  <div class="container">
    <h2>老师页面</h2>
    <div class="content ub ub-pj">
      <div class="ub ub-ver">
        My
        <video src="" id="rtcA" muted controls autoplay></video>
      </div>
      <div class="ub ub-ver">
        Remote-student
        <video src="" id="rtcB" muted controls autoplay></video>
        <button @click="initPeer">呼叫学生</button>
      </div>
    </div>
  </div>
</template>

<script>
import socket from '../utils/socket'

export default {
  name: "teacher",
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
        console.log(this.localstream, '本地媒体流')
        let video = document.querySelector('#rtcA');
        video.srcObject = this.localstream;
      } catch (e) {
        console.log('getUserMedia: ', e)
      }
      //this.initPeer(data); // 获取到媒体流后，调用函数初始化 RTCPeerConnection
    },
    async createOffer() { // 创建并发送 offer
      try {
        // 创建offer
        let offer = await this.peer.createOffer(this.offerOption);
        console.log('老师sdp信息', offer)
        // 呼叫端设置本地 offer 描述
        await this.peer.setLocalDescription(offer);
        // 给对方发送 offer
        socket.emit('Server-Offer', {from: 'teacher', to: 'student', sdp: offer});
      } catch (e) {
        console.log('createOffer: ', e);
      }
    },
    async onIce(data) { // 接收 ICE 候选
      if (data.from === 'teacher') return
      try {
        await this.peer.addIceCandidate(data.candidate); // 设置远程 ICE
      } catch (e) {
        console.log('onAnswer: ', e);
      }
    },
    async onAnswer(data) { // 接收answer
      try {
        console.log(data)
        await this.peer.setRemoteDescription(data.sdp); // 呼叫端设置远程 answer 描述
      } catch (e) {
        console.log('onAnswer: ', e);
      }
    },
    initPeer() {
      // 创建输出端 PeerConnection
      let PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
      this.peer = new PeerConnection(this.iceServers);
      //this.peer.addStream(this.localstream); // 添加本地流,过时了
      for (const track of this.localstream.getTracks()) {
        this.peer.addTrack(track, this.localstream);
      }
      // 监听ICE候选信息 如果收集到，就发送给对方
      this.peer.onicecandidate = (event) => {
        console.log('获取老师网络信息', event.candidate)
        if (event.candidate) {
          socket.emit('Server-ICE', {from: 'teacher', to: 'student', candidate: event.candidate});
        }
      };
      // this.peer.onaddstream = (event) => {
      //   console.log('老师获取新增流')
      //   let video = document.querySelector('#rtcB');
      //   video.srcObject = event.stream;
      // };
      this.peer.ontrack = (event) => { // 监听是否有媒体流接入，如果有就赋值给 rtcB 的 src
        console.log('老师获取新增流', event)
        let video = document.querySelector('#rtcB');
        video.srcObject = event.streams[0];
      };

      this.createOffer()
      socket.on('Client-ICE', data => this.onIce(data))
      socket.on('Client-Answer', data => this.onAnswer(data))
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
