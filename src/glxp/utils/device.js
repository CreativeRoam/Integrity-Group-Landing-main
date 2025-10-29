// import debounce from '@/glxp/utils/debounce'

const ua = window.navigator.userAgent

export const isFirefox = navigator.userAgent.indexOf('Firefox') > -1
export const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0

export const isIE = /* @cc_on!@ */ false || !!document.documentMode
export const isEdge = !isIE && !!window.StyleMedia
export const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
export const isBlink = (isChrome || isOpera) && !!window.CSS

export const isIOS = ua.match(/iPad/i) || ua.match(/iPhone/i);
export const isWebkit = ua.match(/WebKit/i);
export const isSafariIOS = isIOS && isWebkit && !ua.match(/CriOS/i);
export const isSafariDesktop = isIOS == null && /^((?!chrome|android).)*safari/i.test(ua);

export let isMobile = false
export let isTablet = false
export let isSmartphonePortrait = false
export let isDesktop = true

function setDeviceValues() {
  isMobile = typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1
  isTablet = ua.match(/(iPad)/) /* iOS pre 13 */ || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) /* iPad OS 13 */
  isSmartphonePortrait = document.documentElement.clientHeight > document.documentElement.clientWidth && document.documentElement.clientWidth < 1024
  isDesktop = !isMobile && !isTablet
}

setDeviceValues()

// uncomment this if you need to update values on resize
// const debouncedResize = debounce(setDeviceValues, 30)
// window.addEventListener('resize', debouncedResize)

// function iOS() {
//   return [
//     'iPad Simulator',
//     'iPhone Simulator',
//     'iPod Simulator',
//     'iPad',
//     'iPhone',
//     'iPod'
//   ].includes(navigator.platform) ||
//   // iPad on iOS 13 detection
//   (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
// }

// disclaimer: apparently it works on iOS but it doesn't work on Chrome on Pixel4a and MacOS
// async function isLowPower() {
//   return new Promise((resolve) => {
//     const video = document.createElement('video')
//     video.muted = true
//     video.preload = true
//     video.loop = true
//     video.autoplay = true
//     video.setAttribute('webkit-playsinline', 'webkit-playsinline')
//     video.setAttribute('playsinline', 'playsinline')
//     video.addEventListener('canplaythrough', () => {
//       let isLow = false
//       if (video.paused) {
//         isLow = true
//       }
//       video.remove()
//       resolve(isLow)
//     })
//     video.src='data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAACAG1wNDJpc28yYXZjMW1wNDEAAANObW9vdgAAAGxtdmhkAAAAAOA5QnjgOUJ4AAAD6AAAAEMAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAmt0cmFrAAAAXHRraGQAAAAD4DlCeOA5QngAAAABAAAAAAAAAEMAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAACAAAAAgAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAABDAAAAAAABAAAAAAHjbWRpYQAAACBtZGhkAAAAAOA5QnjgOUJ4AAFfkAAAF3BVxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAABjm1pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAU5zdGJsAAAAznN0c2QAAAAAAAAAAQAAAL5hdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAACAAIABIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAAMWF2Y0MBTUAo/+EAGWdNQCjspLYC1BgYGQAAAwABAAK/IA8YMZYBAAVo6uEyyAAAABNjb2xybmNseAAGAAYABgAAAAAQcGFzcAAAAAEAAAABAAAAFGJ0cnQAAAAAAAF1IAABdSAAAAAYc3R0cwAAAAAAAAABAAAAAgAAC7gAAAAUc3RzcwAAAAAAAAABAAAAAQAAABxzdHNjAAAAAAAAAAEAAAABAAAAAgAAAAEAAAAcc3RzegAAAAAAAAAAAAAAAgAAAxAAAAAMAAAAFHN0Y28AAAAAAAAAAQAAA34AAABvdWR0YQAAAGdtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABtZGlyYXBwbAAAAAAAAAAAAAAAADppbHN0AAAAMql0b28AAAAqZGF0YQAAAAEAAAAASGFuZEJyYWtlIDEuNi4xIDIwMjMwMTIyMDAAAAAIZnJlZQAAAyRtZGF0AAAC9AYF///w3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE2NCByMzEwMCBlZDBmN2E2IC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAyMiAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTIgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MToweDExMSBtZT1oZXggc3VibWU9NiBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MCBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTEgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTEga2V5aW50PTMwMCBrZXlpbnRfbWluPTMwIHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9MzAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMi4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCB2YnZfbWF4cmF0ZT0yMDAwMCB2YnZfYnVmc2l6ZT0yNTAwMCBjcmZfbWF4PTAuMCBuYWxfaHJkPW5vbmUgZmlsbGVyPTAgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAABRliIQAK//+9q78yyt0fpUs1YVPgQAAAAhBmiFsQn/+Vg=='
//   })
// }

// export const isIOS = iOS()
// export const isLowPowerMode = isLowPower()
