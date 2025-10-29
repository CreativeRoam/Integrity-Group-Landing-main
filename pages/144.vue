<template>
  <main ref="main" class="site-wrapper">
    <nav ref="navDesktop" class="nav-desktop hidden">
      <a class="logo" href="https://integrity.ai">
        <svg fill="#000000" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 238.02 65.34">
          <path d="M39.6,34.57v-5.08c0-4.11-1.73-6.17-5.25-6.17s-5.74,2.82-5.74,2.82v-2.86l-3.6.76c.22.28.38.62.48,1.02.1.4.17,1.01.2,1.85.03.84.05,2.22.05,4.16v3.5c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.02s0-6.86,0-6.86c.51-.51,1.17-.92,1.98-1.24.82-.32,1.65-.48,2.51-.48,1.17,0,2.03.34,2.59,1.02.56.68.84,1.75.84,3.2v4.36c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5s-.12-1.85-.12-3.68Z"/>
          <path d="M95.95,23.32c-3.29,0-4.69,2.82-4.69,2.82l-.03-2.86-3.56.73c.24.31.41.66.51,1.07.1.41.16,1.04.18,1.9.02.85.03,2.37.03,4.55v3.04c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.01v-6.86c1.12-.99,2.43-1.32,3.93-1.32.66,0,1.29.1,1.88.3l-.36-3.27c-.33-.07-.62-.1-.86-.1Z"/>
          <path d="M167.02,23.32c-3.29,0-4.69,2.82-4.69,2.82l-.03-2.86-3.56.73c.24.31.41.66.51,1.07.1.41.16,1.04.18,1.9.02.85.03,2.37.03,4.55v3.04c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.01v-6.86c1.12-.99,2.43-1.32,3.93-1.32.66,0,1.29.1,1.88.3l-.36-3.27c-.33-.07-.62-.1-.86-.1Z"/>
          <path d="M129.24,23.46c.09.75-.07,1.81-.49,3.17,0,0-3.08,8.66-3.71,10.27-.54-1.72-3.45-10.17-3.45-10.17-.37-1.19-.56-2.1-.56-2.74,0-.24,0-.42.03-.53h-4.09c.25.44.49.96.73,1.55.24.6.54,1.39.89,2.38,0,0,4.57,12.67,4.83,13.57-.42,1.43-1.06,3.09-1.65,3.83-.59.74-1.33,1.11-2.21,1.11-.99,0-1.92-.28-3.09-.83l.4,3.11c1.3.49,3.56.87,5.66-.35.76-.45,1.39-1.27,1.96-2.31s1.67-3.65,2.22-5.41c.57-1.76,4.89-12.63,4.89-12.63.18-.44.29-.71.33-.82.48-1.36.92-2.43,1.32-3.2h-4.01Z"/>
          <path d="M177.5,23.31c-6.09,0-8.56,4.37-8.56,8.25h0c0,3.9,2.48,8.52,8.56,8.52s8.31-4.64,8.31-8.53-2.22-8.24-8.31-8.24ZM177.49,37.85c-4.19,0-5.23-3.79-5.23-6.29s.91-5.99,5.23-5.99,4.99,3.48,4.99,5.99-.8,6.29-4.99,6.29Z"/>
          <path d="M220.34,26.79c-.54-1.15-1.26-2.01-2.15-2.57s-1.87-.84-2.95-.84c-3.63,0-5.58,2.82-5.58,2.82v-2.86l-3.56.76c.31.4.5.9.58,1.52.08.62.12,1.71.12,3.27v19.68l3.5-.76c-.22-.38-.36-.86-.43-1.44-.07-.59-.1-1.66-.1-3.22h-.01s0-3.9,0-3.9c1.32.59,2.53.89,3.63.89,1.46,0,2.76-.34,3.93-1.04,1.17-.7,2.1-1.73,2.79-3.09.69-1.36,1.04-3.01,1.04-4.95,0-1.69-.27-3.11-.81-4.27ZM217.41,34.85c-.49.96-1.12,1.65-1.88,2.08h.01c-.76.44-1.55.65-2.36.65-.68,0-1.25-.06-1.7-.18s-1.02-.35-1.7-.68v-8.98c.39-.42,1-.82,1.81-1.19s1.7-.56,2.67-.56c1.2,0,2.16.45,2.85,1.34.69.89,1.04,2.17,1.04,3.84,0,1.5-.24,2.72-.74,3.68Z"/>
          <polygon points="51.9 37.19 51.9 37.19 51.9 37.19 51.9 37.19"/>
          <path d="M52.48,26.34l-.17-2.9c-1.06.13-2.6.2-4.62.2v-3.53h-.03l-5.18,6.14v.1c.64-.13,1.39-.2,2.24-.2v8.42c0,1.98.39,3.39,1.17,4.24.78.85,1.91,1.27,3.38,1.27.81,0,1.61-.11,2.42-.31l.21-2.58c-.09.04-.19.09-.28.11-.55.18-1.12.26-1.72.26-.84,0-1.41-.24-1.73-.73-.32-.49-.48-1.36-.48-2.64v-8.05c2.4,0,3.99.07,4.79.2Z"/>
          <path d="M115.78,26.34l-.17-2.9c-1.06.13-2.6.2-4.62.2v-3.53h-.03l-5.18,6.14v.1c.64-.13,1.39-.2,2.24-.2v8.42c0,1.98.39,3.39,1.17,4.24.78.85,1.91,1.27,3.38,1.27.81,0,1.61-.11,2.42-.31l.21-2.58h0c-.09.04-.19.09-.28.11-.55.18-1.12.26-1.72.26-.84,0-1.41-.24-1.73-.73-.32-.49-.48-1.36-.48-2.64v-8.05c2.4,0,3.99.07,4.79.2Z"/>
          <path d="M62.5,23.3c-2.72-.17-4.53.64-5.9,1.91-1.82,1.69-2.53,4.08-2.5,6.81.04,3.21,1.43,5.41,3.44,6.86s5.86,1.61,9.04.27l.4-3.07h-.01c-3.58,2.51-7.74,1.88-9.38-1.53-.29-.59-.52-1.64-.54-2.82l2.6.9s2.43-.88,4.35-1.6c1.58-.59,3.47-1.35,3.47-1.35.38-.39.19-1.5.12-1.88-.35-1.99-1.84-4.3-5.09-4.5ZM63.18,29.3l-6.13,2.41c-.02-2.06.64-4.5,2.93-5.55,3.13-1.44,4.68.39,4.86,2.02.05.44-.55.64-1.66,1.12Z"/>
          <path d="M202.69,36.12c-.03-.84-.05-2.22-.05-4.16v-8.61l-3.56.78c.24.37.4.87.48,1.5.08.63.12,1,.12,2.83h-.02v7.26c-.51.51-1.17.92-1.98,1.24-.82.32-1.65.48-2.51.48-1.17,0-2.03-.34-2.59-1.02s-.84-1.75-.84-3.2v-9.87l-3.56.78c.24.37.4.87.48,1.5s.12,1,.12,2.83v5.48c0,4.11,1.73,6.17,5.25,6.17s5.74-2.82,5.74-2.82v2.46l3.6-.76c-.22-.28-.38-.62-.48-1.02-.1-.4-.17-1.01-.2-1.85Z"/>
          <path d="M20.46,34.57h.01v-11.22c-1.35.84-3.5.76-3.5.76.22.38.36.86.43,1.44.07.58.1,1.64.1,3.18v5.84c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68Z"/>
          <path d="M20.58,19.21c.18-.32.08-1.06-.27-1.54-.32-.46-.77-.77-1.44-.87-.62-.09-1.13.04-1.56.4-.43.36-.68.81-.76,1.35-.09.6.06,1.21.44,1.61.42.45,2.84.33,3.59-.95Z"/>
          <path d="M102.92,34.57h0v-11.22c-1.35.84-3.5.76-3.5.76.22.38.36.86.43,1.44.07.58.1,1.64.1,3.18v5.84c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68Z"/>
          <path d="M103.04,19.21c.18-.32.08-1.06-.27-1.54-.32-.46-.77-.77-1.44-.87-.62-.09-1.13.04-1.56.4-.43.36-.68.81-.76,1.35-.09.6.06,1.21.44,1.61.42.45,2.84.33,3.59-.95Z"/>
          <path d="M80.43,39.19h.02c-1.43-.17-6.8-.07-6.8-1.13,0-.5,1.49-.84,3.52-1.39.77-.21,1.61-.51,2.54-.88-.03,0-.07.01-.11.02,2.95-.81,4.88-3.11,4.88-6.14,0-2.36-1.27-4.28-3.2-5.39.28.02.64.03,1.1.03.75,0,1.55-.07,2.41-.2l-.73-2.61c-.73.46-1.78.86-3.15,1.2-1.36.34-2.55.51-3.58.51h-.17c-4.01,0-7.31,2.66-7.31,6.46s2.92,6.35,7.08,6.45c-.11.01-.19.02-.19.02-4.51.79-5.71,1.61-5.71,3.14s2.45,1.95,4.7,2.14c3.78.33,6.57.89,6.57,2.72,0,1.68-4.56,2.18-6.42,1.97-5.03-.55-4.09-2.84-1.65-3.51l-1.01-.17c-2.27.63-3.44,1.45-3.44,2.93,0,2.13,3.08,3.26,6.66,3.26,3.11,0,8.97-1.11,8.97-4.92,0-2.45-1.78-4.1-4.98-4.51ZM72.9,29.66c0-2.1,1.41-4.02,4.28-4.02s4.28,1.92,4.28,4.02-1.43,4.02-4.28,4.02c-2.7,0-4.28-1.92-4.28-4.02Z"/>
          <path d="M151.48,39.19h.02c-1.43-.17-6.8-.07-6.8-1.13,0-.5,1.49-.84,3.52-1.39.77-.21,1.61-.51,2.54-.88-.03,0-.07.01-.11.02,2.95-.81,4.88-3.11,4.88-6.14,0-2.36-1.27-4.28-3.2-5.39.28.02.64.03,1.1.03.75,0,1.55-.07,2.41-.2l-.73-2.61c-.73.46-1.78.86-3.15,1.2-1.36.34-2.55.51-3.58.51h-.17c-4.01,0-7.31,2.66-7.31,6.46s2.92,6.35,7.08,6.45c-.11.01-.19.02-.19.02-4.51.79-5.71,1.61-5.71,3.14s2.45,1.95,4.7,2.14c3.78.33,6.57.89,6.57,2.72,0,1.68-4.56,2.18-6.42,1.97-5.03-.55-4.09-2.84-1.65-3.51l-1.01-.17c-2.27.63-3.44,1.45-3.44,2.93,0,2.13,3.08,3.26,6.66,3.26,3.11,0,8.97-1.11,8.97-4.92,0-2.45-1.78-4.1-4.98-4.51ZM143.95,29.66c0-2.1,1.41-4.02,4.28-4.02s4.28,1.92,4.28,4.02-1.43,4.02-4.28,4.02c-2.7,0-4.28-1.92-4.28-4.02Z"/>
        </svg>
      </a>
      <ul>
        <!-- <li><a class="external" href="https://integrity.ai">Integrity Group</a></li> -->
        <li><a class="external" href="https://integrityhealth.ai/">Health</a></li>
        <li><a class="external" href="https://integrity.org/">Foundation</a></li>
      </ul>
    </nav>
    <Loader />
    
    <header ref="header" class="header-section hidden">
      <WebGL />
      <div class="header-content">
        <svg class="header-logo" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 238.02 65.34">
          <path d="M39.6,34.57v-5.08c0-4.11-1.73-6.17-5.25-6.17s-5.74,2.82-5.74,2.82v-2.86l-3.6.76c.22.28.38.62.48,1.02.1.4.17,1.01.2,1.85.03.84.05,2.22.05,4.16v3.5c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.02s0-6.86,0-6.86c.51-.51,1.17-.92,1.98-1.24.82-.32,1.65-.48,2.51-.48,1.17,0,2.03.34,2.59,1.02.56.68.84,1.75.84,3.2v4.36c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5s-.12-1.85-.12-3.68Z"/>
          <path d="M95.95,23.32c-3.29,0-4.69,2.82-4.69,2.82l-.03-2.86-3.56.73c.24.31.41.66.51,1.07.1.41.16,1.04.18,1.9.02.85.03,2.37.03,4.55v3.04c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.01v-6.86c1.12-.99,2.43-1.32,3.93-1.32.66,0,1.29.1,1.88.3l-.36-3.27c-.33-.07-.62-.1-.86-.1Z"/>
          <path d="M167.02,23.32c-3.29,0-4.69,2.82-4.69,2.82l-.03-2.86-3.56.73c.24.31.41.66.51,1.07.1.41.16,1.04.18,1.9.02.85.03,2.37.03,4.55v3.04c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.01v-6.86c1.12-.99,2.43-1.32,3.93-1.32.66,0,1.29.1,1.88.3l-.36-3.27c-.33-.07-.62-.1-.86-.1Z"/>
          <path d="M129.24,23.46c.09.75-.07,1.81-.49,3.17,0,0-3.08,8.66-3.71,10.27-.54-1.72-3.45-10.17-3.45-10.17-.37-1.19-.56-2.1-.56-2.74,0-.24,0-.42.03-.53h-4.09c.25.44.49.96.73,1.55.24.6.54,1.39.89,2.38,0,0,4.57,12.67,4.83,13.57-.42,1.43-1.06,3.09-1.65,3.83-.59.74-1.33,1.11-2.21,1.11-.99,0-1.92-.28-3.09-.83l.4,3.11c1.3.49,3.56.87,5.66-.35.76-.45,1.39-1.27,1.96-2.31s1.67-3.65,2.22-5.41c.57-1.76,4.89-12.63,4.89-12.63.18-.44.29-.71.33-.82.48-1.36.92-2.43,1.32-3.2h-4.01Z"/>
          <path d="M177.5,23.31c-6.09,0-8.56,4.37-8.56,8.25h0c0,3.9,2.48,8.52,8.56,8.52s8.31-4.64,8.31-8.53-2.22-8.24-8.31-8.24ZM177.49,37.85c-4.19,0-5.23-3.79-5.23-6.29s.91-5.99,5.23-5.99,4.99,3.48,4.99,5.99-.8,6.29-4.99,6.29Z"/>
          <path d="M220.34,26.79c-.54-1.15-1.26-2.01-2.15-2.57s-1.87-.84-2.95-.84c-3.63,0-5.58,2.82-5.58,2.82v-2.86l-3.56.76c.31.4.5.9.58,1.52.08.62.12,1.71.12,3.27v19.68l3.5-.76c-.22-.38-.36-.86-.43-1.44-.07-.59-.1-1.66-.1-3.22h-.01s0-3.9,0-3.9c1.32.59,2.53.89,3.63.89,1.46,0,2.76-.34,3.93-1.04,1.17-.7,2.1-1.73,2.79-3.09.69-1.36,1.04-3.01,1.04-4.95,0-1.69-.27-3.11-.81-4.27ZM217.41,34.85c-.49.96-1.12,1.65-1.88,2.08h.01c-.76.44-1.55.65-2.36.65-.68,0-1.25-.06-1.7-.18s-1.02-.35-1.7-.68v-8.98c.39-.42,1-.82,1.81-1.19s1.7-.56,2.67-.56c1.2,0,2.16.45,2.85,1.34.69.89,1.04,2.17,1.04,3.84,0,1.5-.24,2.72-.74,3.68Z"/>
          <polygon points="51.9 37.19 51.9 37.19 51.9 37.19 51.9 37.19"/>
          <path d="M52.48,26.34l-.17-2.9c-1.06.13-2.6.2-4.62.2v-3.53h-.03l-5.18,6.14v.1c.64-.13,1.39-.2,2.24-.2v8.42c0,1.98.39,3.39,1.17,4.24.78.85,1.91,1.27,3.38,1.27.81,0,1.61-.11,2.42-.31l.21-2.58c-.09.04-.19.09-.28.11-.55.18-1.12.26-1.72.26-.84,0-1.41-.24-1.73-.73-.32-.49-.48-1.36-.48-2.64v-8.05c2.4,0,3.99.07,4.79.2Z"/>
          <path d="M115.78,26.34l-.17-2.9c-1.06.13-2.6.2-4.62.2v-3.53h-.03l-5.18,6.14v.1c.64-.13,1.39-.2,2.24-.2v8.42c0,1.98.39,3.39,1.17,4.24.78.85,1.91,1.27,3.38,1.27.81,0,1.61-.11,2.42-.31l.21-2.58h0c-.09.04-.19.09-.28.11-.55.18-1.12.26-1.72.26-.84,0-1.41-.24-1.73-.73-.32-.49-.48-1.36-.48-2.64v-8.05c2.4,0,3.99.07,4.79.2Z"/>
          <path d="M62.5,23.3c-2.72-.17-4.53.64-5.9,1.91-1.82,1.69-2.53,4.08-2.5,6.81.04,3.21,1.43,5.41,3.44,6.86s5.86,1.61,9.04.27l.4-3.07h-.01c-3.58,2.51-7.74,1.88-9.38-1.53-.29-.59-.52-1.64-.54-2.82l2.6.9s2.43-.88,4.35-1.6c1.58-.59,3.47-1.35,3.47-1.35.38-.39.19-1.5.12-1.88-.35-1.99-1.84-4.3-5.09-4.5ZM63.18,29.3l-6.13,2.41c-.02-2.06.64-4.5,2.93-5.55,3.13-1.44,4.68.39,4.86,2.02.05.44-.55.64-1.66,1.12Z"/>
          <path d="M202.69,36.12c-.03-.84-.05-2.22-.05-4.16v-8.61l-3.56.78c.24.37.4.87.48,1.5.08.63.12,1,.12,2.83h-.02v7.26c-.51.51-1.17.92-1.98,1.24-.82.32-1.65.48-2.51.48-1.17,0-2.03-.34-2.59-1.02s-.84-1.75-.84-3.2v-9.87l-3.56.78c.24.37.4.87.48,1.5s.12,1,.12,2.83v5.48c0,4.11,1.73,6.17,5.25,6.17s5.74-2.82,5.74-2.82v2.46l3.6-.76c-.22-.28-.38-.62-.48-1.02-.1-.4-.17-1.01-.2-1.85Z"/>
          <path d="M20.46,34.57h.01v-11.22c-1.35.84-3.5.76-3.5.76.22.38.36.86.43,1.44.07.58.1,1.64.1,3.18v5.84c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68Z"/>
          <path d="M20.58,19.21c.18-.32.08-1.06-.27-1.54-.32-.46-.77-.77-1.44-.87-.62-.09-1.13.04-1.56.4-.43.36-.68.81-.76,1.35-.09.6.06,1.21.44,1.61.42.45,2.84.33,3.59-.95Z"/>
          <path d="M102.92,34.57h0v-11.22c-1.35.84-3.5.76-3.5.76.22.38.36.86.43,1.44.07.58.1,1.64.1,3.18v5.84c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68Z"/>
          <path d="M103.04,19.21c.18-.32.08-1.06-.27-1.54-.32-.46-.77-.77-1.44-.87-.62-.09-1.13.04-1.56.4-.43.36-.68.81-.76,1.35-.09.6.06,1.21.44,1.61.42.45,2.84.33,3.59-.95Z"/>
          <path d="M80.43,39.19h.02c-1.43-.17-6.8-.07-6.8-1.13,0-.5,1.49-.84,3.52-1.39.77-.21,1.61-.51,2.54-.88-.03,0-.07.01-.11.02,2.95-.81,4.88-3.11,4.88-6.14,0-2.36-1.27-4.28-3.2-5.39.28.02.64.03,1.1.03.75,0,1.55-.07,2.41-.2l-.73-2.61c-.73.46-1.78.86-3.15,1.2-1.36.34-2.55.51-3.58.51h-.17c-4.01,0-7.31,2.66-7.31,6.46s2.92,6.35,7.08,6.45c-.11.01-.19.02-.19.02-4.51.79-5.71,1.61-5.71,3.14s2.45,1.95,4.7,2.14c3.78.33,6.57.89,6.57,2.72,0,1.68-4.56,2.18-6.42,1.97-5.03-.55-4.09-2.84-1.65-3.51l-1.01-.17c-2.27.63-3.44,1.45-3.44,2.93,0,2.13,3.08,3.26,6.66,3.26,3.11,0,8.97-1.11,8.97-4.92,0-2.45-1.78-4.1-4.98-4.51ZM72.9,29.66c0-2.1,1.41-4.02,4.28-4.02s4.28,1.92,4.28,4.02-1.43,4.02-4.28,4.02c-2.7,0-4.28-1.92-4.28-4.02Z"/>
          <path d="M151.48,39.19h.02c-1.43-.17-6.8-.07-6.8-1.13,0-.5,1.49-.84,3.52-1.39.77-.21,1.61-.51,2.54-.88-.03,0-.07.01-.11.02,2.95-.81,4.88-3.11,4.88-6.14,0-2.36-1.27-4.28-3.2-5.39.28.02.64.03,1.1.03.75,0,1.55-.07,2.41-.2l-.73-2.61c-.73.46-1.78.86-3.15,1.2-1.36.34-2.55.51-3.58.51h-.17c-4.01,0-7.31,2.66-7.31,6.46s2.92,6.35,7.08,6.45c-.11.01-.19.02-.19.02-4.51.79-5.71,1.61-5.71,3.14s2.45,1.95,4.7,2.14c3.78.33,6.57.89,6.57,2.72,0,1.68-4.56,2.18-6.42,1.97-5.03-.55-4.09-2.84-1.65-3.51l-1.01-.17c-2.27.63-3.44,1.45-3.44,2.93,0,2.13,3.08,3.26,6.66,3.26,3.11,0,8.97-1.11,8.97-4.92,0-2.45-1.78-4.1-4.98-4.51ZM143.95,29.66c0-2.1,1.41-4.02,4.28-4.02s4.28,1.92,4.28,4.02-1.43,4.02-4.28,4.02c-2.7,0-4.28-1.92-4.28-4.02Z"/>
        </svg>
        <h1 class="header-title">Creating technology with a conscience</h1>
      </div>
    </header>

    <div ref="contentContainer" class="page-content hidden">
      <h1 style="display: none;">Integrity Group</h1>
      
      <!-- Section 1: Introduction -->
      <section class="content-section content-section--gradient">
        <div class="content-section__inner">
          <h2 style="margin-top: .5rem;">Profit with purpose</h2>
          <h3>The Integrity Group exists to reimagine prosperity as a pathway to purpose. By converting growth into access and intelligence into empathy, we build technology aligned with its highest potential: to uplift, to connect and to heal.</h3>
          <p>Technology can be one of the most powerful forces ever created, capable of enhancing the lives of billions, curing diseases and reshaping entire economies. But without purpose, the light of innovation can blind as easily as it can illuminate. It can destroy more than it creates.</p>
          <p>We are building a different kind of system, where intelligence is guided by intention.</p>
          <p>Where capital and compassion fuel each other.</p>
          <p>Where technology serves humanity, not the other way around.</p>
        </div>
      </section>

      <!-- Section 2: The Integrity Model -->
      <section class="content-section content-section--gradient content-section--alt">
        <div class="content-section__inner">
          <h2>The Integrity model</h2>
          <h3>We believe the engines of capitalism and the missions of philanthropy are capable of working together harmoniously. Our model unites them — as one ecosystem of for-profit innovation and nonprofit purpose.</h3>
          <p>We operate across three distinct entities:</p>
          <ul>
            <li><a href="https://integrity.ai">integrity.ai</a> builds and scales fundamental AI technology through invention, investment, and acquisition. It operates on our <span class="italic">Ethical AI</span> framework, ensuring that what we create accelerates progress while protecting the fragile systems we depend on. <span class="italic">Fifty-one percent</span> of returns from integrity.ai will perpetually fund the Integrity Foundation, creating a self-sustaining loop of impact.</li>
            <li><a href="https://www.integrity.org/">Integrity Foundation</a> expands access to AI in underserved segments of the population and funds primary research and education in areas that improve mental health and human wellbeing. We run the Foundation with the spirit of a startup, meaning fast, creative, and driven by impact. Innovation isn’t just encouraged. It is rewarded. Our pay and benefits match those of our for-profit ventures, honoring great work with equal value across every team</li>
            <li><a href="https://integrityhealth.ai">Integrity Health</a> is our first major venture powered by integrity.ai’s foundational framework: an AI-first, human-centered operating system that expands access to evidence-based health and wellness. It unites, enables and curates the vast array of digital therapeutics, personalized human support, and wellness ecosystems into one coherent experience designed to heal at scale while keeping people, not algorithms, at the center. Because when people are mentally well, everything else works better for families, communities, economies, and the future itself.</li>
          </ul>
        </div>
      </section>

      <!-- Section 3: What Is Ethical AI -->
      <section class="content-section content-section--gradient">
        <div class="content-section__inner">
          <h2>What is ethical AI?</h2>
          <h3>Artificial intelligence is rewriting the rules of work, health, and society. It can concentrate power in the hands of a few, or expand opportunity for everyone. The outcome depends on the frameworks we design today.</h3>
          <p>Ethical AI ensures transparency, data integrity, and accountability into every layer of design, using technology to enhance human potential and restore balance across social, economic, and ecological systems.</p>
          <p>It is not about limiting innovation. It is about ensuring that what we create amplifies life, rather than extracts from it.</p>
          <p>Ethical AI is not a product feature. It is a philosophy, a living system for building intelligence with and for humanity.</p>
        </div>
      </section>

      <!-- Section 5: Who We Are -->
      <section id="about" class="content-section content-section--gradient content-section--alt">
        <div class="content-section__inner">
          <h2>Who we are</h2>
          <h4><a href="https://www.linkedin.com/in/bjarratt/">Braxton Jarratt</a> | The Catalyst</h4>
          <p>I have spent my career building technology that changes how people connect, live and work, from the early days of high-speed consumer internet to platforms that reshaped how the world watches, learns, communicates, and organizes.</p>
          <p>I saw the profound potential of artificial intelligence firsthand when my startup was acquired by IBM’s Watson AI group a decade ago. Along the way, I have witnessed world-transforming innovation unfold before my eyes, and seen what happens when progress outpaces intention.</p>
          <p>Technology has the power to create and to consume or destroy. It can expand human potential or reduce it to metrics. After decades leading companies through rapid growth, I began asking a different question: not how fast can we build, but why are we building?</p>
          <p>I founded the Integrity Group to bring that question back to the center of my work and life. I believe artificial intelligence can serve humanity — when guided by human values that resonate with me, such as transparency, empathy, and purpose.</p>
          <p>Integrity is not just a slogan. It is a design principle for my life and my work. I truly believe that when intelligence and intention align, technology doesn’t replace us. It elevates us.</p>
          <h4 style="margin-top: 3rem;"><a href="https://www.linkedin.com/in/eric-burns-05b63613/">Eric Burns</a> | Dollars and Sense</h4>
          <p>For the past 15 years, I have had the privilege of advising clients on some of their most important transactions, going public, raising capital, acquiring or being acquired. My career as an investment banker was a pleasant surprise in many ways, characterized by fewer Gordon Gekkos than expected as colleagues, brilliant young people with energy, travel around the world, and an opportunity to partner with the leadership and entrepreneurs that fuel high growth technology companies, large conglomerates and everything in between. But yes, people should continue to make fun of investment bankers.</p>
          <p>I spent years speaking with founders and executives about the potential for AI to transform industries. That future is here now, and it feels overwhelming to think about the impact AI is having this year, much less a decade from now. There are deep philosophical and ethical questions at hand.</p>
          <p>But I am optimistic, and hopeful, that AI with the right ethical and governance frameworks, can help fix broken systems within our society, like healthcare, while allowing the people within those systems to be more human than they ever have been.</p>
          <h4 style="margin-top: 3rem;"><a href="https://www.linkedin.com/in/dwightwitherspoon/">Dwight Witherspoon</a> | Narrative Alchemist</h4>
          <p>I have spent more than 20 years in the tech industry, and what a ride it has been. I was there when Sun Microsystems put the dot in dotcom, when Ericsson launched 3G, 4G, and 5G, and when the media industry shifted from video stores to streaming. I’ve watched software evolve from proprietary code to open, visual, and collaborative systems that unlocked innovation for millions. And I’ve had the privilege of working with teams at the World Food Programme, who used mobile technology to reconnect communities after natural disasters in developing parts of the world.</p>
          <p>Those were exciting times, moments when technology really did make life better. But as the years went on, I began to feel a growing disconnect. Too often, the industry became consumed by valuation, speed, and scale, not by solving the problems that truly matter. Climate change, healthcare, mental health, homelessness, and wealth inequality - these challenges persist not because we lack intelligence, but because we have lacked intention.</p>
          <p>Now we are standing at the start of another transformation. Artificial intelligence holds extraordinary promise: the ability to accelerate solutions, empower individuals, and reimagine how we live and work. But if left unchecked, it could also deepen divides and erode trust.</p>
          <p>That is why I joined Braxton and Eric in launching the Integrity Group. AI will shape the future, but how it shapes humanity depends on the integrity of those building it.</p>
        </div>
      </section>

      <!-- Section 6: Final Invitation -->
      <section class="content-section content-section--gradient">
        <div class="content-section__inner">
          <h2>An invitation</h2>
          <h3>This isn’t a manifesto. It’s an open invitation to co-create what comes next.</h3>

          <p>To the investors who care what their capital builds.<br>
          To the technologists who believe code can have a conscience.<br>
          To the dreamers who still believe optimism is the most human act of all.<br>
          </p>

          <p>Join us.<br>
          💜 <a href="mailto:hello@integrity.ai" class="email">hello@integrity.ai</a></p>
        </div>
      </section>

      <footer>
        <section class="content-section">
          <div class="content-section__inner">
            <div class="nav-mobile">
                <ul>
                  <!-- <li><a class="external" href="https://integrity.ai/">Integrity Group</a></li> -->
                  <li><a class="external" href="https://integrity.org/">Foundation</a></li>
                  <li><a class="external" href="https://integrityhealth.ai/">Health</a></li>
                </ul>
              </div>
          </div>
        </section>
      </footer>
    </div>
  </main>
</template>

<script>
// Components
// -- Partials
import WebGL from '@/components/partials/WebGL.vue'
import Loader from '@/components/partials/Loader.vue'

export default {
  name: '144',
  components: {
    WebGL,
    Loader,
  },
  computed: {
    mode: function () {
      return import.meta.env.VUE_APP_MODE || 'app'
    },
  },
  watch: {},
  mounted() {
    setTimeout(() => {
      this.$refs.header.classList.remove('hidden')
      this.$refs.contentContainer.classList.remove('hidden')
    }, 500)

    window.addEventListener('scroll', ()=>{      
      if ((window.pageYOffset / window.innerHeight) > .5) {
        this.$refs.navDesktop.classList.remove('hidden')
      } else {        
        this.$refs.navDesktop.classList.add('hidden')
      }
    })

    // Intersection Observer for section animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = entry.target.children
          Array.from(children).forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('content-section__child--visible')
            }, index * 50) // Stagger by 100ms per child
          })
        }
      })
    }, observerOptions)

    // Observe all content-section__inner elements
    const sections = document.querySelectorAll('.content-section__inner')
    sections.forEach(section => {
      observer.observe(section)
    })
  },
  methods: {
    // showAboutSection(e) {
    //   e.preventDefault()
    //   this.$refs.textSection.classList.add('hidden')
    //   setTimeout(() => {
    //     this.$refs.textSection.classList.add('off')
    //     this.$refs.aboutSection.classList.remove('off')
    //     window.scrollTo({
    //       top: 0,
    //       left: 0,
    //       behavior: 'instant',
    //     })
    //   }, 500)
    //   setTimeout(() => {
    //     this.$refs.aboutSection.classList.remove('hidden')
    //   }, 550)
    // },

    // hideAboutSection(e) {
    //   e.preventDefault()
    //   this.$refs.aboutSection.classList.add('hidden')
    //   setTimeout(() => {
    //     this.$refs.aboutSection.classList.add('off')
    //     this.$refs.textSection.classList.remove('off')
    //     window.scrollTo({
    //       top: 0,
    //       left: 0,
    //       behavior: 'instant',
    //     })
    //   }, 500)
    //   setTimeout(() => {
    //     this.$refs.textSection.classList.remove('hidden')
    //   }, 550)
    // },
  },
}
</script>

<style lang="scss">
.site-wrapper {
  // position: relative;
  overflow-x: hidden;
  background-color: white;
  font-size: 18px;
}

.header-section {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.header-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 10;
  width: 90%;
  max-width: 960px;
  padding-bottom: 60px;
}

.header-logo {
  width: 100%;
  // max-width: 300px;
  height: auto;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 1.5rem;
  }
}

.header-title {
  font-family: 'Graebenbach-Medium';
  font-size: 110%;
  letter-spacing: 0.1em;
  line-height: 1.2em;
  color: #ffffff;
  margin: 0;
  margin-top: -2.75em;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 36px;
    margin-top: -20px !important;
    width: 70%;
  }
}


nav {
  position: fixed;
  top: 0;
  left: 0;
  height: 90px;
  width: 100%;
  z-index: 110;
  display: flex !important;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px !important;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  transition: opacity .5s ease;

  &.hidden {
    opacity: 0;
  }

  ul {
    list-style: none;
    width: auto;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;
  }

  a {
    color: #000000; 
    font-size: 1em;
    line-height: 1em;
    font-family: 'SctoGroteskA-Regular';
    text-decoration: underline;
    opacity: .75;
    transition: opacity .2s ease;
    will-change: opacity;

    &:hover {
      opacity: 1;
    }
    
    &.external {
      font-family: 'SctoGroteskA-Regular';
    }
  }

  a.logo {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 180px;
    height: auto;

    svg {
      width: 100%;
      height: auto;
    }
  }

  .divider {
    height: 1px;
    width: 30px;
    background-color: #000000;
  }
}

.nav-desktop {
  @media (max-width: 768px) {
    display: none !important;
  }
}

.nav-mobile {
  // position: relative;
  padding: 2rem 0;
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.3);
  display: none;

  @media (max-width: 768px) {
    display: block !important;
  }

  ul {
    list-style: none !important;
    padding: 0 !important;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0rem;
    margin-left: 0 !important;
  }

  li {
    width: 100%;
  }

  a {
    color: #000000; 
    font-size: .9em;
    line-height: 1em;
    font-family: 'SctoGroteskA-Regular';
    text-decoration: underline;
    opacity: .75;
    transition: opacity .2s ease;
    display: block;

    &:hover {
      opacity: 1;
    }
    
    &.external {
      font-family: 'SctoGroteskA-Regular';
    }
  }
}

.page-content {
  width: 100%;
  // transition: opacity 1s ease;

  // &.hidden {
  //   opacity: 0;
  // }
}

.content-section {
  width: 100%;
  padding: 3rem 0;
  background-color: white;
  position: relative;

  &--gradient {
    padding-bottom: 120px;
  }

  &--gradient::before {
    content: '';
    position: absolute;
    top: -200px;
    left: 0;
    width: 100%;
    height: 200px;
    transform: scaleY(-100%);
    background: linear-gradient(
      #ffffff 0%,
      #ffffffbc 19%,
      #ffffff8a 34%,
      #ffffff61 47%,
      #ffffff47 56.5%,
      #ffffff31 65%,
      #ffffff20 73%,
      #ffffff13 80.2%,
      #ffffff0b 86.1%,
      #ffffff05 91%,
      #ffffff02 95.2%,
      #ffffff01 98.2%,
      #ffffff00 100%
    );
  }

  @media (max-width: 768px) {
    padding: 2rem 0;
    padding-bottom: 90px;
    padding-top: 30px;
  }

  &--alt {
    background-color: #eee3de;

    &::before {
      background: linear-gradient(
        #eee3de 0%,
        #eee3debc 19%,
        #eee3de8a 34%,
        #eee3de61 47%,
        #eee3de47 56.5%,
        #eee3de31 65%,
        #eee3de20 73%,
        #eee3de13 80.2%,
        #eee3de0b 86.1%,
        #eee3de05 91%,
        #eee3de02 95.2%,
        #eee3de01 98.2%,
        #eee3de00 100%
      );
    }
  }

  &__inner {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 5%;

    > * {
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 1s cubic-bezier(0.37, 0, 0.16, 1), transform 1s cubic-bezier(0.37, 0, 0.16, 1);
    }

    @media (max-width: 768px) {
      padding: 0 30px;
    }
  }

  // Text styling
  font-family: 'SctoGroteskA-Regular';
  color: #000000;
  line-height: 1.2em;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    // font-size: 1rem;
  }

  p {
    font-family: 'SctoGroteskA-Regular';
    font-size: 18px;
    line-height: 24px;
    padding-bottom: 12px;
    color: #333333;
  }

  b {
    font-family: 'Graebenbach-Medium';
  }
  
  h1 {
    margin-bottom: .5rem;
    font-family: 'Graebenbach-Medium';
    font-size: em;
    line-height: 1.1em;
    text-align: center;
    color: #000000;

    @media (max-width: 768px) {
      // font-size: 1.5em;
    }
  }

  h2 {
    font-family: 'Graebenbach-Medium';
    font-size: 18px;
    text-transform: uppercase;
    line-height: 30px;
    margin-bottom: 20px;
    margin-top: 20px;
    color: #333333;
    letter-spacing: 0.1em;
    @media (max-width: 768px) {
      // font-size: 1.75em;
    }
  }

  h3 {
    font-family: 'Graebenbach-MediumItalic';
    font-size: 22px;
    line-height: 30px;
    margin-bottom: 20px;
    letter-spacing: 0.01em;
    color: #333333;
  }

  h4 {
    font-family: 'Graebenbach-MediumItalic';
    font-size: 22px;
    line-height: 30px;
    margin-bottom: 20px;
    letter-spacing: 0.01em;
    color: #333333;

    a {
      font-family: 'Graebenbach-Medium';
    }
  }

  .highlight-container {
    margin-top: 2rem;
  }

  a.highlight {
    display: block;
    font-family: 'Graebenbach-Medium';
    font-size: 1.2em;
    line-height: 1.1em;
    margin-bottom: 0.5rem;
  }

  .italic {
    font-family: 'SctoGroteskA-RegularItalic';
  }
  
  ul {
    margin-bottom: 1rem;
    // padding-left: 1.5rem;
    // list-style-type: disc;
    
    > li {
      margin-bottom: 1em;
      line-height: 1.4em;
      position: relative;
      display: list-item;
      
      &::marker {
        color: #000000;
      }
      
      ul {
        margin-top: 0.75rem;
        margin-bottom: 0.5rem;
        list-style-type: circle;
      }
    }
  }
  
  a {
    color: #000000;
    text-decoration: underline;
    font-family: 'Graebenbach-Medium';

    &.email {
      font-family: 'SctoGroteskA-Regular' !important;
    }
    
    &:hover {
      opacity: 0.7;
    }
  }
}

.content-section__child--visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
}
</style>
