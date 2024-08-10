window.onload = function() {
  console.log("document.onload");
  let canvas = document.getElementById('game');
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
  let ctx = canvas.getContext('2d');
  loadOver(ctx, startEvent);
}

let connectCount = 0;
function loadOver(ctx, callback) {
  fetch('http://localhost:3000/api', {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "load_over",
      canvas_width: ctx.canvas.width,
      canvas_height: ctx.canvas.height
    })
  }).then(function(res) {
    if (res.ok) {
      console.log("Server connected");
      callback(ctx);
    } else {
      console.log("Server is not alive. Trying to reconnect...");
      if (connectCount < 5) {
        connectCount++;
        setTimeout(loadOver, 5000, ctx);
      } else {
        console.log("Server is not alive. Please try again later.");
      }
    }
  });
}

function startEvent(ctx) {
  const event_source = new EventSource('http://localhost:3000/update-api');
  event_source.addEventListener('open', function(e) {
    console.log("Event Server connected");
  });
  event_source.addEventListener('message', function(e) {
    console.log("Receive message: ", e.data);
    let data = JSON.parse(e.data);
    switch(data.type) {
      case "update":
        console.log(data.body);
        break;
      default:
        break;
    }
    delete data;
  })
}