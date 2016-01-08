var hwdata = {
    labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};

var hwoptions = {
    //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleBeginAtZero : true,

    //Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines : true,

    //String - Colour of the grid lines
    scaleGridLineColor : "rgba(0,0,0,.05)",

    //Number - Width of the grid lines
    scaleGridLineWidth : 1,

    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,

    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: true,

    //Boolean - If there is a stroke on each bar
    barShowStroke : true,

    //Number - Pixel width of the bar stroke
    barStrokeWidth : 2,

    //Number - Spacing between each of the X value sets
    barValueSpacing : 5,

    //Number - Spacing between data sets within X values
    barDatasetSpacing : 1,

    //String - A legend template
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

}

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
    var hwChart = new Chart(ctx).Bar(hwdata, hwoptions);

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
