//-------------------------------------------------------------------
//Hi guys and girls, My name is Nix and thank you for taking the time
//to try this script out. I have had a lot of fun learning javascript
//and I always have fun playing on just-dice.com. I feel now that
//this script is finished and I have achieved what I originally set
//out to do. Feel free to use this in any way you wish, as I love
//open source.
//
//I would like to thank darby999 and TSavo. I have learnt a  lot from
//both of these great developers and they are both instrumental in
//The creation of this bot. I would also like to thank Ticer from
//http://bitcoinproject.net/ for the sexy theme.
//
//Peace
//Nix
//
//-------------------------------------------------------------------
//            Added a licence To ensure freedoms.
//-------------------------------------------------------------------
//Copyright (C) 2013  CriticalNix
//
//This program is free software; you can redistribute it and/or
//modify it under the terms of the GNU General Public License
//version 2.
//
//This program is distributed in the hope that it will be useful,
//but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//GNU General Public License for more details.
//
//A full copy of the GNU General Public License, version 2 can be found here. http://www.gnu.org/licenses/gpl-2.0.html
//-------------------------------------------------------------------
var master = $('#uid').text();
var name_usr = $('#nick').text();
var timer;
var bal;
var bet;
var current_steps = 1; //Used to find our current step
var start_bet = 0; //value used to hold starting bet
var $multiplier;
var $steps;
var $run;
var running = false; //If set to true the script will start when the page loads
var arr_bets = new Array(); //create an array to store bets in.
var timer_num = 1400; //Timer delay between bets. 1000 = 1 second.
var current_bet_num = 0; //Steps counter used to find reset loss
var lastBal = 0; //balance that is grabbed in check_step
var yin_yang = 0; //counting wins
var yin_yang2 = 0; //percentage of rolls that are wins
var check_step = 0; //Simple switch to make sure we grab the balance once
var bet_total = 0; //Total bets
var new_val = 0.00000001;
var snd = new Audio('https://dl.dropboxusercontent.com/u/27471347/beep-7.mp3');
var coin_drop = new Audio('https://dl.dropboxusercontent.com/u/27471347/coin-drop-1.mp3');
var win1 = 0;
var lose1 = 0;
var max_win = 0;
var max_loss = 0;
var current_win_per = 0;
var rndhilo = 1;
var today = "";
var user_chk = 1;
var version_c = "1.0.6";  


function appendVersion() {
	var footer = "<div style='position:fixed;bottom:0px;background-color:white;'>Bot version" + (version_c) + " </div>"
		$("body").append(footer);
}

function test_css() { // shows a loaded message in log area
	document.querySelector(".log").innerHTML = "Automated betting system" + (version_c) + " loaded.";
	setInterval(function () {
		document.querySelector(".log").innerHTML = " ";
	}, 6000);
}

function simp_rand() { //simple random function to select from hi or lo
	var rndhilo = Math.random() < 0.5 ? 1 : 0;
	if ($('#rand_check').prop('checked')) {
		if (rndhilo == 1) {
			$("#a_hi").trigger('click');
		} else {
			$("#a_lo").trigger('click');
		}
	} else {
		$("#a_hi").trigger('click');
	}
}

function play_sound() {
	if ($('#sound_check').prop('checked')) {
		coin_drop.play();
		coin_drop.currentTime = 0;
	} else {
		// empty =)
	}
}

function max_loss_streak() { // function to update longest loss streak
	$("#max_loss").css("color", "red");
	setInterval(function () {
		if (lose1 > max_loss) {
			max_loss++;
			$("#max_loss").val(max_loss);
		} else {
			// nothing here move along XD
		}
	}, 800);
}

function max_win_streak() { //function to update longest win streak
	$("#max_win").css("color", "green");
	setInterval(function () {
		if (win1 > max_win) {
			max_win++;
			$("#max_win").val(max_win);
		} else {
			// nothing here move along XD
		}
	}, 800);
}

function bust_chance() { //probability, guess and suggested multiplier

	setInterval(function () {

		//probability
		var ccbust1 = parseFloat($("#pct_chance").val());
		var ccbust2 = parseFloat($("#steps").val());
		cBust1 = 1 - ccbust1 / 100;
		cBust2 = Math.pow(cBust1, ccbust2) * 100;

		$("#magic_amt").val(cBust2.toFixed(10));

		//suggested multiplier
		multi3 = 0;
		multi3 = (99 / (99 - (ccbust1)) + 0.1);
		var current_balance = parseFloat($("#pct_balance").val());

		$("#Guess_amt").val((multi3).toFixed(8));

		//win guess
		if (yin_yang2 > ccbust1) {
			$("#var_guess").val('expect -');
			$("#win_lose").css("color", "green");
			$("#var_guess").css("color", "red");
		} else if (yin_yang2 < ccbust1) {
			$("#var_guess").val('expect +');
			$("#win_lose").css("color", "red");
			$("#var_guess").css("color", "green");
		}

	}, 800);
}

function profit_color() {
	var profit = parseFloat($("#pct_balance").val()) - lastBal;

	if (profit > 0) {
		$("#pro_fits").css("color", "green");
	} else if (profit < 0) {
		$("#pro_fits").css("color", "red");
	} else {
		$("#pro_fits").css("color", "black");
	}
}

function gets_date() { //gets the current date
	var now = new Date();
	var strDateTime = [[AddZero(now.getDate()), AddZero(now.getMonth() + 1), now.getFullYear()].join("/"), [AddZero(now.getHours()), AddZero(now.getMinutes())].join(":"), now.getHours() >= 12 ? "PM" : "AM"].join(" ");

	//Pad given value to the left with "0"
	function AddZero(num) {
		return (num >= 0 && num < 10) ? "0" + num : num + "";
	}
	arr_bets.push(strDateTime + '----');
}

function sleep(milliseconds) { //delay function
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function emoticons(text){
    var url = "https://dl.dropboxusercontent.com/u/27471347/emote/";

    var searchFor = /:D|:-D|:\)|:-\)|;\)|';-\)|:\(|:-\(|:o|:\?|8-\)|:x|:P/gi;

    // A map mapping each smiley to its image
    var map = {
        ":D"  : '4.gif', // Capped version of the next
        ":d"  : '4.gif', // Lower case version of the previous
        ":-D" : '4.gif', // Capped version of the next
        ":-d" : '4.gif', // Lower case version of the previous
        ":)"  : '1.gif',
        ":-)" : '1.gif',
        ";)"  : '3.gif',
        "';-)" : '3.gif',

        ":("  : '2.gif',
        ":-(" : '2.gif',
        ":O"  : '13.gif', // Capped version of the next
        ":o"  : '13', // Lower case version of the previous
        ":?"  : '7.gif',
        "8-)" : '16.gif',

        ":X"  : '14.gif',    // Capped version of the next
        ":x"  : '14.gif',    // Lower case version of the previous
        ":P"  : '10.gif',   // Capped version of the next
        ":p"  : '10.gif'    // Lower case version of the previous
    };

    text = text.replace(searchFor, function(match) {
        var rep;

        rep = map[match];

        return rep ? '<img src="' + url + rep + '" class="emoticons" />' : match;
    });

    return (text);
}

function parse_chat() {
var arr_time = new Array();
var db_url = "https://dl.dropboxusercontent.com/u/27471347/emote/"

	setInterval(function () {
		var toParse = $("div#chat .chatline:last-child").text();
		var reg_id = /\(([^)]+)\)/;
		var reg_usr = /\<([^)]+)\>/;
        var reg_time =  /(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/;
		var id_num = reg_id.exec(toParse);
		var id_usr = reg_usr.exec(toParse);
        var id_time = reg_time.exec(toParse);
		var cleanMsg = toParse.split("> ")[1];
		var log_tag = (id_time[0]);
        
        
		if ((log_tag) != (arr_time[0])) {
            arr_time.unshift(log_tag);
           var chat_line = $("div#chat .chatline:last-child").html();
           //console.log(chat_line);
           var chat_line = emoticons(chat_line);
           //console.log(chat_line);
           $("div#chat .chatline:last-child").html(chat_line);
           

			//console.log(id_time[0] + ' ID: ' + id_num[1] + ' user: ' + id_usr[1] + ' message: ' + cleanMsg);
			if (id_num[1] == master && id_usr[1] == name_usr) {
				if (cleanMsg == "Bstop") {
                        c_stop_bot();
                }else if (cleanMsg == "Commands") {
					sleep(1000);
					alert("Bstart: this will start the bot"+'\n'+"Bstop: this will stop the bot");
					console.log('Alert commands.');
				}else if (cleanMsg == "Bstart") {
					sleep(1000);
                        c_start_bot();
					//console.log('Bot simulate start!');

				} 
                
			}
		}
	}, 300);

}

function c_start_bot(){
	var answer = confirm("Are you sure?" + '\n' + "Ready to start martingale?")
	if (answer){
		alert("Good luck!")
            console.log('Bot started from command');
            //alert('would of started');
			        running = true;		        
			        start_bet = $("#pct_bet").val();
			        $("#a_hi").trigger('click');
	}
	else{
		console.log('Bot start aborted');
	}
}

function c_stop_bot(){
    console.log('Bot stopped from command');
    clearInterval(timer);
    running = false;
    current_steps = 1;
}

function save_to_file() { //saves information to a .bin file that can be opened with notepad
arr_bets.push('Saved ---');
	gets_date();
	window.webkitRequestFileSystem(window.TEMPORARY, 1024 * 1024, function (fs) {
		fs.root.getFile('open-with-notepad.bin', {
			create : true
		}, function (fileEntry) {
			fileEntry.createWriter(function (fileWriter) {

				var blob = new Blob([arr_bets]);

				fileWriter.addEventListener("writeend", function () {
					// navigate to file, will download
					location.href = fileEntry.toURL();
				}, false);

				fileWriter.write(blob);
			}, function () {});
		}, function () {});
	}, function () {});
}
// end of get date and save to file

function popArray() { //populate bet array with the information we want.
	if (check_step == 0)
		     {
			lastBal = parseFloat($("#pct_balance").val());
			check_step = 1;			        
		}
	else {
		arr_bets.push('Bet#-' + bet_total + ',');
		var c_balance = parseFloat($("#pct_balance").val());
		arr_bets.push('Balance-' + c_balance + ',');
		var profit = c_balance - lastBal;
		arr_bets.push('profit-' + profit + ',');
		var c_chance = parseFloat($("#pct_chance").val());
		arr_bets.push('chance-' + c_chance + ',');
	}

}

function martingale() { //the main martingale function

	                
	  if(bal.data('oldVal') != bal.val() && running) {
		    clearInterval(timer);

		    var curr_bal = bal.val();
		// add a single step to grab starting balance and stop value
		if (check_step == 0)
			     {
				lastBal = parseFloat($("#pct_balance").val());
				check_step = 1;
				        
			}

		//Add a step into the martingale to see if we reach our desired loss length, If so reset
		if (current_bet_num == $delay.val() && curr_bal < bal.data('oldVal')) // this is Reset loss step
			     {
				current_bet_num = 1;
				        $("#pct_bet").val(start_bet);
				         var profit = parseFloat($("#pct_balance").val()) - lastBal;
				            var new_val = ($('#pct_balance').val() / 100) * ($percentage).val();

				yin_yang2 = ((yin_yang / bet_total) * 100); //win % = wins/total bets * 100 // This gives us our percentage win

				             //get rid of scientific notation
				            if(String(new_val).indexOf('e') !== -1) {
					                var arr = new Array();
					                arr = String(new_val).split('e');
					                  new_val = new_val.toFixed(arr[1].substring(1));
					         console.log('new_val=' + new_val);
					        
				}

				            
				            $("#pct_bet").val(new_val);

				             //Increase the steps
				         current_steps = 1;
				             //current_steps++;
				bet_total++;
				lose1++;
				win1 = 0;
				simp_rand();
				popArray();
				$("#win_lose").val((yin_yang2).toFixed(2)); //Update win %
				$("#pro_fits").val((profit).toFixed(8)); //Update Profit
				profit_color();
				$("#Bet_amt").val(bet_total); //Update bet counter
				        
			}
		     //end of reset loss step
		else if (curr_bal > bal.data('oldVal')) //This is win step
			     {
				play_sound();
				        current_steps = 1;
				current_bet_num = 0;
				        $("#pct_bet").val(start_bet);
				             //Increase our bet by the multiplier
				var profit = parseFloat($("#pct_balance").val()) - lastBal;
				            var new_val = $("#pct_bet").val(); // Why I had left a multiplyer here.. Madness Fixed now.

				yin_yang2 = ((yin_yang / bet_total) * 100); //win % = wins/total bets * 100 // This gives us our percentage win

				             //get rid of scientific notation
				            if(String(new_val).indexOf('e') !== -1) {
					                var arr = new Array();
					                arr = String(new_val).split('e');
					                  new_val = new_val.toFixed(arr[1].substring(1));
					         console.log('new_val=' + new_val);
					        
				}

				            
				            $("#pct_bet").val(new_val);
				$("#win_lose").val(yin_yang);

				             //Increase the steps
				current_steps++;
				current_bet_num++;
				yin_yang++;
				bet_total++;
				lose1 = 0;
				win1++;
				simp_rand();
				popArray();
				$("#win_lose").val((yin_yang2).toFixed(2)); //Update win %
				$("#pro_fits").val((profit).toFixed(8)); //Update Profit
				profit_color();
				$("#Bet_amt").val(bet_total); //Update bet counter
				        
			} //end of win step
		    
		        
		    else if ($.isNumeric($multiplier.val()) && // This is loss step
			             $.isNumeric($steps.val()) &&
			            ((current_steps - 1) < $steps.val())) {

			             //Increase our bet by the multiplier
			var profit = parseFloat($("#pct_balance").val()) - lastBal;
			            var new_val = $("#pct_bet").val() * $multiplier.val();

			yin_yang2 = ((yin_yang / bet_total) * 100); //win % = wins/total bets * 100 // This gives us our percentage win

			             //get rid of scientific notation
			            if(String(new_val).indexOf('e') !== -1) {
				                var arr = new Array();
				                arr = String(new_val).split('e');
				                  new_val = new_val.toFixed(arr[1].substring(1));
				         console.log('new_val=' + new_val);
				        
			}

			            
			            $("#pct_bet").val(new_val);
			$("#win_lose").val((yin_yang2).toFixed(2)); //Update win %
			$("#pro_fits").val((profit).toFixed(8)); //Update Profit
			profit_color();
			$("#Bet_amt").val(bet_total); //Update bet counter

			             //Increase the steps
			current_steps++;
			current_bet_num++;
			bet_total++;
			lose1++;
			win1 = 0;
			simp_rand();
			popArray();

		} //end of loss step

		     //otherwise we go back to the start
		    else { //This is bust step
			var profit = parseFloat($("#pct_balance").val()) - lastBal;
			yin_yang2 = ((yin_yang / bet_total) * 100); //win % = wins/total bets * 100 // This gives us our percentage win
			      current_steps = 1;
			current_bet_num = 0;
			      $("#pct_bet").val(start_bet);
			$("#win_lose").val((yin_yang2).toFixed(2));
			$("#pro_fits").val((profit).toFixed(8));
			      running = false;
			save_to_file();
			alert("Bot has bust !!");
			    
		} //end of bust step

		     // Updated stored value
		    bal.data('oldVal', bal.val());
		    timer = setInterval(function () {
				martingale()
			}, timer_num);

		  
	}

	  else bal.data('oldVal', bal.val());
	  
}

// A little bit of a help file.
function tabber() {
	        var markup = '<div class="bot-stats"><p><img src="https://i.imgur.com/N6n5UNz.png" width="80" height="80"> Hi Guys and girls thankyou for taking the time to try or use this automated betting system.</p><p> My name is (98066)Nix You can usually find me right here in the chat on JD. If you need to ask anything feel free to, I will help all I can. It has been a lot of fun learning some javascript and it is even more fun trying out new ways (I know trying.) to beat the house at JD.</p><p><strong><u>Show/Hide </u></strong>Look Just under Just-Dice in the upper left corner, Click show/hide to display or hide the bot.</p><p><strong><u>Multiplyer</u></strong> This is a value used to increase bet on loss eg. 2x multiplier will double your bet on a loss</p><p><strong><u>Max losses</u></strong> This is the amount of consecutive losses you want the bot to be able to handle, The bot will stop upon reaching a loss streak of this length unless Reset loss is a smaller number</p><p><strong><u>Reset loss</u></strong> This is a relatively new feature to martingale. Upon a loss streak reaching this number. the bet value will change to value given in Reset %</p><p><strong><u>Reset %</u></strong> This value is called when Reset loss is reached. This value is a percentage of your total bank. Use extreme caution when setting high numbers here.</p><p><strong><u>probability</u></strong> This is your percentage chance of loss. It is worked out as 1 - (chance towin /100)^multiplier. This is the first time I have wrote anything in javascript using probability. it could be wrong. </p><p><strong><u>Suggested x</u></strong> This is a suggested value for the multiplier, It is worked out as &quot; 99 / (99 - chance to win) &quot;.</p><p><strong><u>Profit display</u></strong> This will show your profit won. If you refresh the page this value will reset.</p><p><strong><u>Win % display</u></strong> This will show wins as a percentage of rolls. You can expect this number to be very close to chance to win.</p><p><u><strong>Max win</strong></u> This will display your max winning streak length.</p><p><u><strong>Max loss</strong></u> This will display your max losing streaklength.</p><p><u><strong>Guess</strong></u>This is a fun little readout that looks at current win percentage vs chance to win and says expect + if it is under and expect - if it is over. This is not a reliable way to predict bets it is just for fun.</p><p><u><strong>Save</strong></u>This will save your sessions bets to a file called &quot;open-with-notepad.bin&quot; as the name sggests you can open this with a text editor.</p><p><u><strong>Chat commands</strong></u> This bot has a built in chat parser that can stop and start the bot from chat commands. Use <strong>Bstart</strong> to start the bot with the values in the GUI and <strong>Bstop</strong> to stop the bot running.</p><p><strong><u>Credits</u></strong> I would like to thank Darby999 for his original script. he was laid up in bed with a broken hip in spring this year and the origins of this script was born. I would also like to thank Wilco for his help with the chat parser and regex </p><p><strong><u>A word of warning</u></strong> Any sort of automated betting system will ultimately contain bugs. Do not ever have more in your balance than you are willing to lose and always use google two factor authentication. Also by no means it this a surefire way of making profit. If you do not understand this please do not use it.</p><p>THIS IS A THIRD PARTY SCRIPT AND IS IN NO WAY AFFILIATED WITH JUST-DICE.COM. JUST-DICE DOES NOT ENDORSE BOTS</p><p>AND AT THE SAME TIME DOES NOT FORBID THEIR USE.</p></div><div class="clear"></div><div class="bot-graph"><p>Check here for updates and new changes or to report issues <A HREF="https://github.com/CriticalNix/just-dice.com">https://github.com/CriticalNix/just-dice.com</A> </p><p align="center" style="border:1px solid; border-color: #505050;">If you win loads or just like this bot consider donating a coffee and a pizza =) ฿ 1Q2yrewqAaxdWHMKkSxTxk61F3c4mRKNR</p></div><p>If you can not donate click a link. It will redirect to a thankyou image on imgur <A HREF="http://cur.lv/4sdxy" target="_blank">http://cur.lv/4sdxy</A> </p><div class="bot-foot">';
	                $panelWrapper = $('<div>').attr('id', 'Nixsy9').css({
			display : 'none'
		}).insertAfter('#faq'),
	                $panel = $('<div>').addClass('panel').append(markup).appendTo($panelWrapper),
	                                
	                                $s_bet = $('#gbs_bet')
		       

		        $('<li>').append($('<a>').text('Bot-Help').attr('href', '#Nixsy9')).appendTo('.tabs');
};

function create_ui() {

	$('.button_inner_group:nth(2)').append(
		       '<button onClick=\'javascript:socket.emit("invest_box", csrf); socket.emit("invest", csrf, "all", $("#invest_code").val());\'>invest all<div class="key">N</div></button>').append(
		       '<button onClick=\'javascript:socket.emit("invest_box", csrf); socket.emit("divest", csrf, "all", $("#divest_code").val());\'>divest all<div class="key">M</div></button>');

	var $saver = $('.button_inner_group:nth(2)')

		$save = $('<button id="c_save" >Save</button>');
	  $save.click(function () {
		save_to_file();
	});
	  $saver.append($save);

	  var $container = $('<div id="chipper" class="container"/>');
	var $container2 = $('<div class="container"/>');
	  var $button_group = $('<div style="width:99%;background-color:#787878 ;border:2px solid; border-color: #505050;" class="button_group"/>');
	  $container.append($button_group);

	  var $martingale_button = $('<button class="button_label chance_toggle" style="margin-top:46px;margin-right:3px;height:65px;;width:70px;color:transparent;background-color:transparent;border:none;"><img src="https://i.imgur.com/xZALcXD.png"></button>');

	  var $run_div = $('<div style="background-color:#787878;margin-top:50px;border:2px solid; border-color: #505050;" class="button_inner_group"/>');
	  $run = $('<button id="c_run" style="margin-bottom:5px;margin-top:5px;margin-left:5px;">Go</button>');

	  $run.click(function () {
		        running = true;
		  start_bet = $("#pct_bet").val();
		  $("#a_hi").trigger('click');
		  
	});
	  $run_div.append($run);

	StartBalance = parseFloat($("#pct_balance").val()); // Try to add profit readout
	    
	  $Stop = $('<button id="c_stop" style="margin-bottom:5px;margin-top:5px;margin-right:5px;margin-left:5px;">Stop</button>');
	  $Stop.click(function () {
		  running = false;
		  $("#pct_bet").val(start_bet);
		  
	});

	  $run_div.append($Stop);
/*   
	  $test = $('<button id="c_stop" style="margin-bottom:5px;margin-top:5px;margin-right:5px;margin-left:5px;">Test</button>');
	  $test.click(function () {
      $("#c_test").click();  
    });  
	  $run_div.append($test);

	  $test2 = $('<button id="c_stop" style="margin-bottom:5px;margin-top:5px;margin-right:5px;margin-left:5px;">Test2</button>');
	  $test2.click(function () {
	save_to_file();
	});
	  $run_div.append($test2);
*/ 
	  var $row1 = $('<div class="row"/>');
	  var $label1 = $('<p style="border:1px solid; border-color: #505050;" class="llabel">Multiplier</p>');
	  $multiplier = $('<input style="border:1px solid; border-color: #505050;" id="multiplier" value="2.1"/>');
	  $multiplier.keyup(function () {
		set_run();
	});
	  var $x = $('<p style="margin-right:15px;border:1px solid; border-color: #505050;" class="rlabel">x</p>');
	  $row1.append($label1);
	  $row1.append($multiplier);
	  $row1.append($x);

	  var $row2 = $('<div class="row"/>');
	  var $label2 = $('<p style="border:1px solid; border-color: #505050;" class="llabel">Max losses</p>');
	  $steps = $('<input style="border:1px solid; border-color: #505050;" id="steps" value="17"/>');
	  $steps.keyup(function () {
		set_run();
	});
	  var $numz = $('<p style="margin-right:15px;border:1px solid; border-color: #505050;" class="rlabel">#</p>');
	  $row2.append($label2);
	  $row2.append($steps);
	  $row2.append($numz);
	 
	  var $row3 = $('<div class="row"/>');
	 
	  var $label3 = $('<p style="border:1px solid; border-color: #505050;" class="llabel">Reset loss</p>');
	  $delay = $('<input style="border:1px solid; border-color: #505050;" id="updateInterval" value="16"/>');
	var $numz2 = $('<p style="margin-right:15px;border:1px solid; border-color: #505050;" class="rlabel">!</p>');
	  $row1.append($label3);
	  $row1.append($delay);
	$row1.append($numz2);

	  var $label4 = $('<p style="border:1px solid; border-color: #505050;" class="llabel">Reset %</p>');
	  $percentage = $('<input style="border:1px solid; border-color: #505050;" id="updateInterval" value="1"/>');
	var $numz3 = $('<p style="margin-right:15px;border:1px solid; border-color: #505050;" class="rlabel">%</p>');
	  $row2.append($label4);
	  $row2.append($percentage);
	$row2.append($numz3);

	  var $label5 = $('<p style="border:1px solid; border-color: #505050;" class="llabel">Profit</p>');
	  $test_bet = $('<input style="border:1px solid; border-color: #505050;" id="pro_fits" value="0" class="readonly"/>');
	var $numz4 = $('<p style="margin-right:15px;border:1px solid; border-color: #505050;" class="rlabel">฿</p>');
	  $row3.append($label5);
	  $row3.append($test_bet);
	$row3.append($numz4);

	  var $label6 = $('<p style="border:1px solid; border-color: #505050;" class="llabel">Win %</p>');
	  $test_betS = $('<input style="border:1px solid; border-color: #505050;" id="win_lose" value="0" class="readonly"/>');
	var $numz5 = $('<p style="margin-right:15px;border:1px solid; border-color: #505050;" class="rlabel">%</p>');
	  $row3.append($label6);
	  $row3.append($test_betS);
	$row3.append($numz5);

	  var $label7 = $('<p style="border:1px solid; border-color: #505050;" class="llabel">Bets</p>');
	  $Bet_amt = $('<input style="border:1px solid; border-color: #505050;" id="Bet_amt" value="0" class="readonly" />');
	var $numz6 = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">#</p>');
	  $row3.append($label7);
	  $row3.append($Bet_amt);
	$row3.append($numz6);

	  var $label8 = $('<p style="border:1px solid; border-color: #505050;" class="llabel">Suggested x</p>');
	  $guess_amt = $('<input style="border:1px solid; border-color: #505050;" id="Guess_amt" value="0" class="readonly" />');
	var $numz7 = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">x</p>');
	  $row2.append($label8);
	  $row2.append($guess_amt);
	$row2.append($numz7);

	  var $label9 = $('<p style="border:1px solid; border-color: #505050;" class="llabel">Probability</p>');
	  $magic_amt = $('<input style="border:1px solid; border-color: #505050;" id="magic_amt" value="0" class="readonly" />');
	var $numz8 = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">%</p>');
	  $row1.append($label9);
	  $row1.append($magic_amt);
	$row1.append($numz8);

	var $row4 = $('<div class="row"/>');
	  var $label10 = $('<p style="border:1px solid; border-color: #505050;" class="llabel">Max win</p>');
	  $max_win = $('<input style="border:1px solid; border-color: #505050;" id="max_win" value="0" class="readonly" />');
	var $numz9 = $('<p style="margin-right:15px;border:1px solid; border-color: #505050;" class="rlabel">#</p>');
	  $row4.append($label10);
	  $row4.append($max_win);
	$row4.append($numz9);

	  var $label11 = $('<p style="border:1px solid; border-color: #505050;" class="llabel">Max loss</p>');
	  $max_loss = $('<input style="border:1px solid; border-color: #505050;" id="max_loss" value="0" class="readonly" />');
	var $numz10 = $('<p style="margin-right:15px;border:1px solid; border-color: #505050;" class="rlabel">#</p>');
	  $row4.append($label11);
	  $row4.append($max_loss);
	$row4.append($numz10);

	  var $label12 = $('<p style="border:1px solid; border-color: #505050;" class="llabel">Guess</p>');
	  $mar_pause = $('<input style="border:1px solid; border-color: #505050;" id="var_guess" value="0" class="readonly" />');
	var $numz11 = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">?</p>');
	  $row4.append($label12);
	  $row4.append($mar_pause);
	$row4.append($numz11);

	  var $fieldset = $('<fieldset style="background-color:transparent;border:2px solid; border-color: #505050;"/>');
	  $fieldset.append($row1);
	  $fieldset.append($row2);
	$fieldset.append($row3);
	$fieldset.append($row4);

	var $sound_box = $('<div class="row"/>');
	$sound_c = $('<div><input type="checkbox" value="1" name="sound_check" id="sound_check" checked="checked" /> play sound on win!</div>')
		$sound_box.append($sound_c);
	$row4.append($sound_box);

	var $rand_box = $('<div class="row"/>');
	$rand_c = $('<div><input type="checkbox" value="1" name="rand_check" id="rand_check" checked="checked" />tick for random hi/lo</div>')
		$rand_box.append($rand_c);
	$row4.append($rand_box);

	  $button_group.append($martingale_button);
	  $button_group.append($fieldset);
	  $button_group.append($run_div);

	$(".container").eq('1').append('<a id="showhidetrigger" href="#">show/hide</a>');
	  $(".container").eq('1').append($container);
	  $(".container").eq('1').append('<div style="clear:left;"/>');
	  
	$(document).ready(function () {
		$('#chipper').hide();
		$('a#showhidetrigger').click(function () {
			$('#chipper').toggle(700);
		});
	});
}

function set_run() {
	  if($multiplier !== undefined &&
		      $steps !== undefined)
	      if($.isNumeric($multiplier.val()) &&
		           $.isNumeric($steps.val()) &&
		           $.isNumeric($('#pct_bet').val())) {

		           var total = 0;
		           var mult = 1;
		           var i;
		          console.log('steps: ' + $steps.val() +
			           '   multiplier:' + $multiplier.val() +
			           '   bal: ' + $('#pct_balance').val() +
			           '   bet:' + $('#pct_bet').val());

		           for(i = 0; i < $steps.val(); i++) {
			             total += $('#pct_bet').val() * mult;
			             mult *= $multiplier.val();
			           
		}
		           console.log('total:' + total);

		           if(total != 0 && total < $('#pct_balance').val()) {
			             console.log("setting class VALID");
			         $run.removeClass('invalid');
			           
		}
		           else {
			             console.log("setting class invalid");
			         $run.addClass('invalid');
			           
		}
		      
	}

	      else {
		        console.log("setting class invalid");
		        $run.addClass('invalid');

		      
	}
}

//
//The main stuff
//
$(document).ready(function () {

	  tabber();

	  console.log('starting');

	  create_ui();

	bust_chance();

	max_loss_streak();

	max_win_streak();

	appendVersion();

	test_css();
    
    parse_chat();
    
    //highlight();

	   //set the balance
	   //when the balance changes and we're martingaling
	   //we'll do our stuff
	  bal = $("#pct_balance");
	  bal.data('oldVal', bal.val());
	  timer = setInterval(function () {
			martingale()
		}, timer_num);

	   //we also monitor the bet b/c it can also determine if
	   //we have enough btc to bet the martingale run
	  bet = $("#pct_bet");
	  bet.data('oldVal', bet.val());
	  setInterval(function () {
		          if(bet.data('oldVal') != bet.val() && !running) {
			             bet.data('oldVal', bet.val());
			         set_run();
			        
		}
		   
	}, 100);
/*
    var KeyMapArr = { // useful to keep around somewhere.
        48: "0", 49: "1", 50: "2", 51: "3", 52: "4", 53: "5", 54: "6", 55: "7",
        56: "8", 57: "9", 59: ";", 61: "=", 65: "a", 66: "b", 67: "c", 68: "d",
        69: "e", 70: "f", 71: "g", 72: "h", 73: "i", 74: "j", 75: "k", 76: "l", 
        77: "m", 78: "n", 79: "o", 80: "p", 81: "q", 82: "r", 83: "s", 84: "t", 
        85: "u", 86: "v", 87: "w", 88: "x", 89: "y", 90: "z", 91: "[", 92: "\\",
        93: "]", 96: "`", 60: "<", 39: "'" 
    };
*/  
    
	 $(document).keydown(function (e) {
		    var ctrlDown = false;
		    var ctrlKey = 17,
		qKey = 81,
		rKey = 82;
        nKey = 79;
        mKey = 78;

		    if(!$(document.activeElement).is('input') &&
			      (e.keyCode == rKey)) {
			        running = true;
			        
			        start_bet = $("#pct_bet").val();
			        $("#a_hi").trigger('click');
			    
		}

		    $(document).keydown(function (e)
			     {
			        if(e.keyCode == ctrlKey)ctrlDown = true;
			    
		}).keyup(function (e)
			     {
			        if(e.keyCode == ctrlKey)ctrlDown = false;
			    
		});

		    if(ctrlDown && (e.keyCode == qKey)) {
			      clearInterval(timer);
			      running = false;
			      current_steps = 1;
			    
		}
        
		    if(ctrlDown && (e.keyCode == nKey)) {
			        $("#c_inv").trigger('click'); // click invest all button
			    
		}
        
		    if(ctrlDown && (e.keyCode == mKey)) {
			        $("#c_div").trigger('click'); // click divest all button
			    
		}
		  
	});

});
