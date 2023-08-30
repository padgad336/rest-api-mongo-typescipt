import path from "path"

export const buildHtml = (contentData: any) => {
  const assetsPath = `${__dirname}/../assets/`
  const icoPic = path.join(assetsPath, 'favicon.ico')
  const imagePic = path.join(assetsPath, 'Nimitr-bg-large.png')
  return `
    <!DOCTYPE html>
<html>
  <head>
    <title>Nimit AR</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" href="${icoPic}" />
    <script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
    <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
    <script>
    // Component that detects and emits events for touch gestures

    AFRAME.registerComponent("gesture-detector", {
      schema: {
        element: { default: "" }
      },
    
      init: function() {
        this.targetElement =
          this.data.element && document.querySelector(this.data.element);
    
        if (!this.targetElement) {
          this.targetElement = this.el;
        }
    
        this.internalState = {
          previousState: null
        };
    
        this.emitGestureEvent = this.emitGestureEvent.bind(this);
    
        this.targetElement.addEventListener("touchstart", this.emitGestureEvent);
    
        this.targetElement.addEventListener("touchend", this.emitGestureEvent);
    
        this.targetElement.addEventListener("touchmove", this.emitGestureEvent);
      },
    
      remove: function() {
        this.targetElement.removeEventListener("touchstart", this.emitGestureEvent);
    
        this.targetElement.removeEventListener("touchend", this.emitGestureEvent);
    
        this.targetElement.removeEventListener("touchmove", this.emitGestureEvent);
      },
    
      emitGestureEvent(event) {
        const currentState = this.getTouchState(event);
    
        const previousState = this.internalState.previousState;
    
        const gestureContinues =
          previousState &&
          currentState &&
          currentState.touchCount == previousState.touchCount;
    
        const gestureEnded = previousState && !gestureContinues;
    
        const gestureStarted = currentState && !gestureContinues;
    
        if (gestureEnded) {
          const eventName =
            this.getEventPrefix(previousState.touchCount) + "fingerend";
    
          this.el.emit(eventName, previousState);
    
          this.internalState.previousState = null;
        }
    
        if (gestureStarted) {
          currentState.startTime = performance.now();
    
          currentState.startPosition = currentState.position;
    
          currentState.startSpread = currentState.spread;
    
          const eventName =
            this.getEventPrefix(currentState.touchCount) + "fingerstart";
    
          this.el.emit(eventName, currentState);
    
          this.internalState.previousState = currentState;
        }
    
        if (gestureContinues) {
          const eventDetail = {
            positionChange: {
              x: currentState.position.x - previousState.position.x,
    
              y: currentState.position.y - previousState.position.y
            }
          };
    
          if (currentState.spread) {
            eventDetail.spreadChange = currentState.spread - previousState.spread;
          }
    
          // Update state with new data
    
          Object.assign(previousState, currentState);
    
          // Add state data to event detail
    
          Object.assign(eventDetail, previousState);
    
          const eventName =
            this.getEventPrefix(currentState.touchCount) + "fingermove";
    
          this.el.emit(eventName, eventDetail);
        }
      },
    
      getTouchState: function(event) {
        if (event.touches.length === 0) {
          return null;
        }
    
        // Convert event.touches to an array so we can use reduce
    
        const touchList = [];
    
        for (let i = 0; i < event.touches.length; i++) {
          touchList.push(event.touches[i]);
        }
    
        const touchState = {
          touchCount: touchList.length
        };
    
        // Calculate center of all current touches
    
        const centerPositionRawX =
          touchList.reduce((sum, touch) => sum + touch.clientX, 0) /
          touchList.length;
    
        const centerPositionRawY =
          touchList.reduce((sum, touch) => sum + touch.clientY, 0) /
          touchList.length;
    
        touchState.positionRaw = { x: centerPositionRawX, y: centerPositionRawY };
    
        // Scale touch position and spread by average of window dimensions
    
        const screenScale = 2 / (window.innerWidth + window.innerHeight);
    
        touchState.position = {
          x: centerPositionRawX * screenScale,
          y: centerPositionRawY * screenScale
        };
    
        // Calculate average spread of touches from the center point
    
        if (touchList.length >= 2) {
          const spread =
            touchList.reduce((sum, touch) => {
              return (
                sum +
                Math.sqrt(
                  Math.pow(centerPositionRawX - touch.clientX, 2) +
                    Math.pow(centerPositionRawY - touch.clientY, 2)
                )
              );
            }, 0) / touchList.length;
    
          touchState.spread = spread * screenScale;
        }
    
        return touchState;
      },
    
      getEventPrefix(touchCount) {
        const numberNames = ["one", "two", "three", "many"];
    
        return numberNames[Math.min(touchCount, 4) - 1];
      }
    });
        </script>
        <script>
        AFRAME.registerComponent("gesture-handler", {
          schema: {
            enabled: { default: true },
            rotationFactor: { default: 5 },
            minScale: { default: 0.3 },
            maxScale: { default: 8 },
          },
        
          init: function () {
            this.handleScale = this.handleScale.bind(this);
            this.handleRotation = this.handleRotation.bind(this);
        
            this.isVisible = false;
            this.initialScale = this.el.object3D.scale.clone();
            this.scaleFactor = 1;
        
            this.el.sceneEl.addEventListener("markerFound", (e) => {
              this.isVisible = true;
            });
        
            this.el.sceneEl.addEventListener("markerLost", (e) => {
              this.isVisible = false;
            });
          },
        
          update: function () {
            if (this.data.enabled) {
              this.el.sceneEl.addEventListener("onefingermove", this.handleRotation);
              this.el.sceneEl.addEventListener("twofingermove", this.handleScale);
            } else {
              this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
              this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
            }
          },
        
          remove: function () {
            this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
            this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
          },
        
          handleRotation: function (event) {
            if (this.isVisible) {
              this.el.object3D.rotation.y +=
                event.detail.positionChange.x * this.data.rotationFactor;
              this.el.object3D.rotation.x +=
                event.detail.positionChange.y * this.data.rotationFactor;
            }
          },
        
          handleScale: function (event) {
            if (this.isVisible) {
              this.scaleFactor *=
                1 + event.detail.spreadChange / event.detail.startSpread;
        
              this.scaleFactor = Math.min(
                Math.max(this.scaleFactor, this.data.minScale),
                this.data.maxScale
              );
        
              this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x;
              this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y;
              this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z;
            }
          },
        });
        </script>

  </head>

  <body style="margin: 0, overflow: 'hidden'">
    <a-scene
    arjs='detectionMode: mono_and_matrix; matrixCodeType: 3x3;'
    renderer="logarithmicDepthBuffer: true;"
    vr-mode-ui="enabled: false"
    gesture-detector
    >

      ${contentData?.map((content: any, index: any) => (
    `
            ${content?.markerdata?.markerPattern &&
    `<a-marker
                    emitevents="true"
                    cursor="fuse: false; rayOrigin: mouse;"
                    type='barcode'
                    value="${content?.markerdata?.markerNo}">
                    <a-entity
                        position="0 0 0"
                        rotation="${content?.rotationX} ${content?.rotationY} ${content?.rotationZ}"
                        scale="${content?.scale} ${content?.scale} ${content?.scale}"
                        gltf-model="${content?.mediadata?.mediaUrl}"
                        gesture-handler
                    ></a-entity>
                </a-marker>`
    }
        `
  ))
    }
      <a-entity camera   mouse-cursor></a-entity>
    </a-scene>
  </body>
</html>
    `
}