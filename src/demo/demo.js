
// import { FocusedImage, FocusPicker } from "image-focus"
import { FocusedImage, FocusPicker } from "../lib/main"
import Thumbor from 'thumbor-ts';

// Get our references to elements
const focusPickerEl = document.getElementById("focus-picker-img") 
const imgSrcEl = document.getElementById("image-src")
const coordinates = document.getElementById("coordinates")
const dataAttributes = document.getElementById("data-attributes") 
const focusedImageElements = document.querySelectorAll(".focused-image") 

// Set our starting focus
const focus = { x: 0, y: 0 }

// Iterate over images and instantiate FocusedImage from each
// pushing into an array for updates later
const focusedImages = []
Array.prototype.forEach.call(focusedImageElements, (imageEl= HTMLImageElement) => {
  focusedImages.push(
    new FocusedImage(imageEl, {
      focus,
      debounceTime: 17,
      updateOnWindowResize: true,
    }),
  )
})

// Instantiate our FocusPicker providing starting focus
// and onChange callback
const focusPicker = new FocusPicker(focusPickerEl, {
  focus,
  onChange: (newFocus) => {
    
    const x = newFocus.x.toFixed(2)
    const y = newFocus.y.toFixed(2)
    coordinates.value = `{x: ${x}, y: ${y}}`
    dataAttributes.value = `data-focus-x="${x}" data-focus-y="${y}"`
    focusedImages.forEach(focusedImage => focusedImage.setFocus(newFocus))
  },
})

imgSrcEl.addEventListener("input", () => {
  focusPicker.img.src = imgSrcEl.value
  focusedImages.forEach(focusedImage => (focusedImage.img.src = imgSrcEl.value))
})


const thumbor = Thumbor({
  serverUrl: 'http://thumbor.thumborize.me',
  // securityKey: ''
});

// Image Zommer Code
const zoomer = (function () {
  let img_ele = null,
    x_cursor = 0,
    y_cursor = 0,
    x_img_ele = 0,
    y_img_ele = 0,
    orig_width = document.getElementById('zoom-img').getBoundingClientRect().width,
    orig_height = document.getElementById('zoom-img').getBoundingClientRect().height,
    current_top = 0,
    current_left = 0,
    zoom_factor = 1.0;

  return {
      zoom: function (zoomincrement) {
        

          img_ele = document.getElementById('zoom-img');
          zoom_factor = zoom_factor + zoomincrement;
          if (zoom_factor <= 1.0)
          {
            const focalLeft = document.getElementById('zoom-img').offsetLeft;
              zoom_factor = 1.0;
              img_ele.style.bottom =  '0px';    
              img_ele.style.left = '0px';
          }
  
          let pre_width = img_ele.getBoundingClientRect().width, pre_height = img_ele.getBoundingClientRect().height;
          console.log('prewidth='+img_ele.getBoundingClientRect().width+'; pre_height ='+img_ele.getBoundingClientRect().height);
          img_ele.style.width = (pre_width * zoomincrement) +'px';
          img_ele.style.height = (pre_height * zoomincrement) +'px';
          let new_width = (orig_width * zoom_factor);
          let new_heigth = (orig_height * zoom_factor);
          console.log('postwidth='+img_ele.style.width+'; postheight ='+img_ele.style.height);

          if (current_left < (orig_width - new_width))
          {
              current_left = (orig_width - new_width);
          }
          if (current_top < (orig_height - new_heigth))
          {
              current_top = (orig_height - new_heigth);
          }

          img_ele.style.bottom = '0';
          img_ele.style.top = '0';
          img_ele.style.width = new_width + 'px';
          img_ele.style.height = new_heigth + 'px';
          

          img_ele = null;

      },

      start_drag: function () {
        if (zoom_factor <= 1.0)
        {
           return;
        }
        img_ele = this;
        x_img_ele = window.event.clientX - document.getElementById('zoom-img').offsetLeft;
        y_img_ele = window.event.clientY - document.getElementById('zoom-img').offsetTop;
        const focalLeft = document.getElementById('zoom-img').offsetLeft;
        const focalRight = document.getElementById('zoom-img').offsetTop;
        console.log('img='+img_ele.toString()+'; x_img_ele='+x_img_ele+'; y_img_ele='+y_img_ele+';')
        console.log('offLeft='+focalLeft+'; offTop='+focalRight)
        console.log('Value',focalLeft)
        // Building URL 
        const thumborUrl = thumbor
        .setPath(`${focusedImageElements[0].src}`)
        .resize(`${img_ele.getBoundingClientRect().width}`,img_ele.getBoundingClientRect().height)
        .focal(focalLeft,focalRight,0,0)
        .buildUrl();
     

        let width = img_ele.getBoundingClientRect().width+'px';
        let height = img_ele.getBoundingClientRect().height+'px'
        let left = focalLeft+'px';
        let right = focalRight + 'px';
       

        const img = document.getElementById("img")
        console.log(img)
        img.src=`${thumborUrl}`;
        img.style.width = width ;
        img.style.height = height ;
        img.style.left=left;
        img.style.top = right;
        // img.style.style.top = 0

        console.log('prewidth='+img_ele.getBoundingClientRect().width+'; pre_height ='+img_ele.getBoundingClientRect().height);
      },

      stop_drag: function () {
        if (img_ele !== null) {
          if (zoom_factor <= 1.0)
          {
            img_ele.style.left = '0px';
            img_ele.style.top =  '0px';      
          }
          console.log(img_ele.style.left+' - '+img_ele.style.top);
          }
        img_ele = null;
      },

      while_drag: function () {
          if (img_ele !== null)
          {
              var x_cursor = window.event.clientX;
              var y_cursor = window.event.clientY;
              var new_left = (x_cursor - x_img_ele);
              if (new_left > 0)
              {
                  new_left = 0;
              }
              if (new_left < (orig_width - img_ele.width))
              {
                  new_left = (orig_width - img_ele.width);
              }
              var new_top = ( y_cursor - y_img_ele);
              if (new_top > 0)
              {
                  new_top = 0;
              }
              if (new_top < (orig_height - img_ele.height))
              {
                  new_top = (orig_height - img_ele.height);
              }
              current_left = new_left;
              img_ele.style.left = new_left + 'px';
              current_top = new_top;
              img_ele.style.top = new_top + 'px';

              console.log(img_ele.style.left+' - '+img_ele.style.top);
          }

      }
      
  };
  
} ());

document.getElementById('zoomout').addEventListener('click', function() {
zoomer.zoom(-0.25);
});
document.getElementById('zoomin').addEventListener('click', function() {
zoomer.zoom(0.25);
});

document.getElementById('zoom-img').addEventListener('mousedown', zoomer.start_drag);
document.getElementById('zoom-container').addEventListener('mousemove', zoomer.while_drag);
document.getElementById('zoom-container').addEventListener('mouseup', zoomer.stop_drag);
document.getElementById('zoom-container').addEventListener('mouseout', zoomer.stop_drag);



