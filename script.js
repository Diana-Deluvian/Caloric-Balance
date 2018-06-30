function pushCals(){
	var entry = $('.intakeInput').val() || $('.expendInput').val();
	var numb = entry.match(/\d/g).join("");
	var gain = false;
	if($('.intakeInput').val()) gain = true; 
	var calorie = {    
	title: entry,
    amount: numb,
    gain: gain
	}

/*    var data = Calorie.serialize();*/
	$.post("Calories", calorie, function( data ){
		displayTotal();
	});
	appendCalorie(calorie);
	


/*	$.ajax({
  		type: "POST",
  		url: "./Calories",
  		data: Calorie,
 		dataType: "json"
	});*/
	
}

function Calories(){
	if(event.which === 13){
		var intake = $('.intakeInput');
		var expend = $('.expendInput');
		if(intake.is(":focus") || expend.is(":focus")){
			pushCals();
			intake.val('');
			expend.val('');
		}
	}
}

$(document).keypress(function(e){
	Calories(e);
	});



function displayCalories(){
	$.get( "/calories", function( calories ) {
		calories.forEach(function(calorie){
			if(compareDates(calorie.added, new Date().toISOString())){
				appendCalorie(calorie);
			}
		});
	});
};

function displayTotal(){
	$.get("/total", function(balance) {
		console.log(balance.total);
		$("#total").text("Balance: " + balance.total)
	})
}


displayCalories();
displayTotal();

function compareDates(date1, date2){
	return date1.substring(0,10) === date2.substring(0, 10);
}

function appendCalorie(calorie){
	if(calorie.gain){
		var li = $("<li class='intakeItem'></li>").text(calorie.title);
		$('.intake ul').append(li);
	} else {
		var li = $("<li class='expendItem'></li>").text(calorie.title);
		$('.expenditure ul').append(li);
	}
}