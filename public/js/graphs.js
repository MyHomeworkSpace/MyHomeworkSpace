window.graph = {}
var hws = [0,0,0,0,0,0,0];
window.graph.graph = function(){
 	//get data
 	var days = [];

 	var hwResult;

	window.api.get('planner/events/getWholeWeek/' + window.utils.formatDate_api(moment().toDate()), function(result) {
 	    var hwResult = result.events;

 	    console.log(result.events.length);
	    var date = window.utils.formatDate_api(moment().toDate());
	    for (var i=0;i<result.events.length;i++){
    	console.log(i);
 			var iDate = window.utils.formatDate_api(moment(hwResult[i]["date"]).toDate());
 			console.log(iDate);
 	        var dayToAssign = (parseInt(iDate[8] + iDate[9])) - parseInt(date[8] + date[9]);console.log(dayToAssign);
 	        hws[dayToAssign] += 1;
 	    }
 	    console.log(hws);
 	});


  	//set up axis for graph
  	switch (new Date().getDay()) {
  	    	case 0:
  			days = ["Sunday","Monday","Tuesday","Wensday","Thursday","Friday","Saturday"];
  			break;
  	    	case 1:
  			days = ["Monday","Tuesday","Wensday","Thursday","Friday","Saturday","Sunday"];
  			break;
  	    	case 2:
  			days = ["Tuesday","Wensday","Thursday","Friday","Saturday","Sunday","Monday"];
  			break;
 	    	case 3:
  			days = ["Wensday","Thursday","Friday","Saturday","Sunday","Monday","Tuesday"];
  			break;
  	    	case 4:
  			days = ["Thursday","Friday","Saturday","Sunday","Monday","Tuesday","Wensday"];
  			break;
 	    	case 5:
  			days = ["Friday","Saturday","Sunday","Monday","Tuesday","Wensday","Thursday"];
  			break;
  	    	case 6:
  			days = ["Saturday","Sunday","Monday","Tuesday","Wensday","Thursday","Friday"];
  			break;
  	}
  	//how do i include this '<script src="http://canvasjs.com/assets/script/canvasjs.min.js"></script>''
	  var chart = new CanvasJS.Chart("chartContainer", {
		theme: "",//theme1
		title:{
			  text: "Your Homework"
		},
		animationEnabled: true,   // change to true
		data: [
		{
			// Change type to "bar", "area", "spline", "pie",etc.
			type: "line",
			dataPoints: [
				{ label: days[0],  y: hws[0]  },
				{ label: days[1], y: hws[1]  },
				{ label: days[2], y: hws[2]  },
				{ label: days[3],  y: hws[3]  },
				{ label: days[4],  y: hws[4]  },
				{ label: days[5], y: hws[5]   },
				{ label: days[6], y: hws[6]   },
			]
		}
		]
	});
	chart.render();
	console.log(hws);


  }

$(document).ready(function() {
	window.graph.graph();
});
