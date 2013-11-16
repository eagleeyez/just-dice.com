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

var timer;
var bal;
var bet;
var current_steps = 1; //Used to find our current step
var start_bet = 0; //value used to hold starting bet
var $multiplier;
var $steps;
var $run;
var running = false; //If set to true the script will start when the page loads
var arr_ignore = new Array(); //create an array to include ignored users
var timer_num = 1400; //Timer delay between bets. 1000 = 1 second.
var current_bet_num = 0; //Steps counter used to find reset loss
var lastBal = 0; //balance that is grabbed in check_step
var yin_yang = 0; //counting wins
var yin_yang2 = 0; //percentage of rolls that are wins
var check_step = 0; //Simple switch to make sure we grab the balance once
var bet_total = 0; //Total bets
var new_val = 0.00000001;
var snd = new Audio('http://www.soundjay.com/button/sounds/beep-7.mp3');
var coin_drop = new Audio('http://www.soundjay.com/misc/sounds/coin-drop-1.mp3');
var win1 = 0;
var lose1 = 0;
var max_win = 0;
var max_loss = 0;

// Extra buttons found on pastebin http://pastebin.com/n8X8uRAT Originally from a user called "v" and edited by another unknown user.

$('.button_inner_group:nth(2)').append(
	       '<button onClick=\'javascript:socket.emit("invest_box", csrf); socket.emit("invest", csrf, "all", $("#invest_code").val());\'>invest all<div class="key">J</div></button>').append(
	       '<button onClick=\'javascript:socket.emit("invest_box", csrf); socket.emit("divest", csrf, "all", $("#divest_code").val());\'>divest all<div class="key">K</div></button>');

var losses = 0;
var lastWin = new Date().getTime();
var profitPerMS = 0;

function play_sound() {
	if ($('#sound_check').prop('checked')) {
		snd.play();
		snd.currentTime = 0;
	} else {
		// empty =)
	}
}

function max_loss_streak() {
	setInterval(function () {
		if (lose1 > max_loss) {
			max_loss++;
            $("#max_loss").val(max_loss);
		} else {
			// nothing here move along XD
		}
	}, 800);
}

function max_win_streak() {
	setInterval(function () {
		if (win1 > max_win) {
			max_win++;
            $("#max_win").val(max_win);
		} else {
			// nothing here move along XD
		}
	}, 800);
}

function Gmultiplier() {
     
      setInterval(function () { //update suggested multiplier
        multi3 = 0;
        multi1 = parseFloat($("#pct_chance").val());
        multi3 = (99 / (99 - (multi1)) + 0.1);
        var current_balance = parseFloat($("#pct_balance").val());

        $("#Guess_amt").val((multi3).toFixed(8));
               
           
    }, 800);
}

function bust_chance(){ //first time I have tried probability so this could very well be wrong.
     
      setInterval(function () {
        var ccbust1 = parseFloat($("#pct_chance").val());
        var ccbust2 = parseFloat($("#steps").val());
        cBust1 = 1 - ccbust1 / 100;
        cBust2 = Math.pow(cBust1, ccbust2) * 100;
 
        $("#magic_amt").val(cBust2.toFixed(10));
    }, 800);
}

function martingale() {

                    
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
                            current_steps++;
                bet_total++;
                lose1++;
                win1 = 0;
                            $("#a_hi").trigger('click');
                $("#win_lose").val((yin_yang2).toFixed(2)); //Update win %
                $("#pro_fits").val((profit).toFixed(8)); //Update Profit
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
                            $("#a_hi").trigger('click');
                $("#win_lose").val((yin_yang2).toFixed(2)); //Update win %
                $("#pro_fits").val((profit).toFixed(8)); //Update Profit
                $("#Bet_amt").val(bet_total); //Update bet counter
                        
            } //end of win step
            
                
            else if ($.isNumeric($multiplier.val()) && // This is loss step
                         $.isNumeric($steps.val()) &&
                        (current_steps < $steps.val())) {

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
            $("#Bet_amt").val(bet_total); //Update bet counter

                         //Increase the steps
                        current_steps++;
            current_bet_num++;
            bet_total++;
            lose1++;
            win1 = 0;
                        $("#a_hi").trigger('click');
                
        } //end of loss step

             //otherwise we go back to the start
            else { //This is bust step

            yin_yang2 = ((yin_yang / bet_total) * 100); //win % = wins/total bets * 100 // This gives us our percentage win
                  current_steps = 1;
            current_bet_num = 0;
                  $("#pct_bet").val(start_bet);
            $("#win_lose").val((yin_yang2).toFixed(2));
            $("#pro_fits").val((profit).toFixed(8));
                  running = false;
                
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
            var markup = '<div class="bot-stats"><p>Hi Guys and girls thankyou for taking the time to try or use this automated betting system.</p><p> My name is (98066)Nix You can usually find me right here in the chat on JD. If you need to ask anything feel free to, I will help all I can. It has been a lot of fun learning some javascript and it is even more fun trying out new ways (I know trying.) to beat the house at JD.</p><p><strong><u>Show/Hide </u></strong>Look Just under Just-Dice in the upper left corner, Click show/hide to display or hide the bot.</p><p><strong><u>Multiplyer</u></strong> This is a value used to increase bet on loss eg. 2x multiplier will double your bet on a loss</p><p><strong><u>Max losses</u></strong> This is the amount of consecutive losses you want the bot to be able to handle, The bot will stop upon reaching a loss streak of this length unless Reset loss is a smaller number</p><p><strong><u>Reset loss</u></strong> This is a relatively new feature to martingale. Upon a loss streak reaching this number. the bet value will change to value given in Reset %</p><p><strong><u>Reset %</u></strong> This value is called when Reset loss is reached. This value is a percentage of your total bank. Use extreme caution when setting high numbers here.</p><p><strong><u>probability</u></strong> This is your percentage chance of loss. It is worked out as 1 - (chance towin /100)^multiplier. This is the first time I have wrote anything in javascript using probability. it could be wrong. </p><p><strong><u>Suggested x</u></strong> This is a suggested value for the multiplier, It is worked out as &quot; 99 / (99 - chance to win) &quot;.</p><p><strong><u>Profit display</u></strong> This will show your profit won. If you refresh the page this value will reset.</p><p><strong><u>Win % display</u></strong> This will show wins as a percentage of rolls. You can expect this number to be very close to chance to win.</p><p><strong><u>Credits</u></strong> I would like to thank Darby999 for his original script. he was laid up in bed with a broken hip in spring this year and the origins of this script was born.</p><p><p><u><strong>Max win</strong></u> This will display your max winning streak length.</p><p><u><strong>Max loss</strong></u> This will display your max losing streaklength.</p><p><strong><u>A word of warning</u></strong> Any sort of automated betting system will ultimately contain bugs. Do not ever have more in your balance than you are willing to lose and always use google two factor authentication. Also by no means it this a surefire way of making profit. If you do not understand this please do not use it.</p><p>&nbsp;</p></div><div class="clear"></div><div class="bot-graph"><p>Check here for updates and new changes or to report issues https://github.com/CriticalNix/just-dice.com</p><p>If you win loads or just like this bot consider donating a coffee and a pizza =) 1NixsyLiMFX3wwLqdtAVsNLsWwqDpbmuhP</p></div><div class="bot-foot">';
                    $panelWrapper = $('<div>').attr('id', 'Nixsy9').css({
            display : 'none'
        }).insertAfter('#faq'),
                    $panel = $('<div>').addClass('panel').append(markup).appendTo($panelWrapper),
                                    
                                    $s_bet = $('#gbs_bet')
               

                $('<li>').append($('<a>').text('Bot-Help').attr('href', '#Nixsy9')).appendTo('.tabs');
};

function ping_user() {

      var log = $(".chatlog");
      log.data('oldVal', log.html());
      log.data('length', 0);
      setInterval(function () {
               
                var new_str = log.html();
                var arr = new Array();
                arr = new_str.split('<div class="chatline">');
                  if(log.data('length') != arr.length || log.data('length') === 101) {

                      var depth;
                      if(log.data('length') === 101) {
                console.log('here');
                depth = 0;
            }
                      else depth = arr.length - 2;

                       //if this is the first time we'll look at every line,
                       //otherwise we'll just do the last (which is arr.length - 2)
                      for(var line_count = depth; line_count < arr.length - 1; line_count++)
                       {

                            var line = arr[line_count];
                            if(typeof line !== 'undefined') {

                                    var line_items = line.split(' ');
                                    var username = $('#login span:first-child').text();
                                    var pos = line_items.indexOf(username, 3);
                                    if(pos >= 0) {
                                            line_items[pos] = line_items[pos].replace(username,
                                                         '<span style="color:red;font-weight:bold;">' + username + '</span>');

                                            var new_line = line_items.join(' ');
                                            arr[line_count] = new_line;
                                        
                    }

                                     //ignore
                                    var i;
                                    for(i = 0; i < arr_ignore.length; i++) {
                                            var ignore_user = '&lt;' + arr_ignore[i] + '&gt;';
                                            var ignore_pos = line_items.indexOf(ignore_user, 2);
                                            console.log('target:' + line_items[2]);
                                            if(ignore_pos > -1)arr[line_count] = 'ignored';
                                        
                    }
                                
                } //if undefined
                        
            } //for

                      var new_log = arr.join('<br>');
                      log.html(new_log);
                         log.data('length', arr.length);
                      console.log('length: ' + arr.length);
                      $.playSound('notify.wav');
                    
        }
           
    }, 100);
}

function status_message() {
msg("test message this is a test!");
}

function create_ui() {

      var $container = $('<div id="chipper" class="container"/>');
    var $container2 = $('<div class="container"/>');
      var $button_group = $('<div style="width:99%;background-color:#878787;border:2px solid; border-color: #6E6E6E;" class="button_group"/>');
      $container.append($button_group);

      var $martingale_button = $('<button class="button_label chance_toggle" style="margin-top:25px;margin-right:3px;height:65px;;width:70px;color:transparent;background-color:transparent;border:none;"><img src="http://i.imgur.com/e3LQ30h.png"></button>');

      var $run_div = $('<div class="button_inner_group"/>');
      $run = $('<button id="c_run" style="margin-top:32px;margin-left:8px;">Go</button>');

      $run.click(function () {
                running = true;
          start_bet = $("#pct_bet").val();
          $("#a_hi").trigger('click');
          
    });
      $run_div.append($run);

    StartBalance = parseFloat($("#pct_balance").val()); // Try to add profit readout
        
      $Stop = $('<button id="c_stop" style="margin-top:32px;margin-left:8px;">Stop</button>');
      $Stop.click(function () {
          running = false;
          $("#pct_bet").val(start_bet);
          
    });
      $run_div.append($Stop); 
/*    
      $test = $('<button id="c_test" style="margin-top:32px;margin-left:8px;">test</button>');
      $test.click(function () {
         status_message();
    });
      $run_div.append($test); 
*/    
      var $row1 = $('<div class="row"/>');
      var $label1 = $('<p style="border:1px solid; border-color: #6E6E6E;" class="llabel">Multiplier</p>');
      $multiplier = $('<input style="border:1px solid; border-color: #6E6E6E;" id="multiplier" value="2.1"/>');
      $multiplier.keyup(function () {
        set_run();
    });
      var $x = $('<p style="margin-right:15px;border:1px solid; border-color: #6E6E6E;" class="rlabel">x</p>');
      $row1.append($label1);
      $row1.append($multiplier);
      $row1.append($x);

      var $row2 = $('<div class="row"/>');
      var $label2 = $('<p style="border:1px solid; border-color: #6E6E6E;" class="llabel">Max losses</p>');
      $steps = $('<input style="border:1px solid; border-color: #6E6E6E;" id="steps" value="17"/>');
      $steps.keyup(function () {
        set_run();
    });
      var $numz = $('<p style="margin-right:15px;border:1px solid; border-color: #6E6E6E;" class="rlabel">#</p>');
      $row2.append($label2);
      $row2.append($steps);
      $row2.append($numz);
     
      var $row3 = $('<div class="row"/>');
     
      var $label3 = $('<p style="border:1px solid; border-color: #6E6E6E;" class="llabel">Reset loss</p>');
      $delay = $('<input style="border:1px solid; border-color: #6E6E6E;" id="updateInterval" value="16"/>');
    var $numz2 = $('<p style="margin-right:15px;border:1px solid; border-color: #6E6E6E;" class="rlabel">!</p>');
      $row1.append($label3);
      $row1.append($delay);
    $row1.append($numz2);

      var $label4 = $('<p style="border:1px solid; border-color: #6E6E6E;" class="llabel">Reset %</p>');
      $percentage = $('<input style="border:1px solid; border-color: #6E6E6E;" id="updateInterval" value="1"/>');
    var $numz3 = $('<p style="margin-right:15px;border:1px solid; border-color: #6E6E6E;" class="rlabel">%</p>');
      $row2.append($label4);
      $row2.append($percentage);
    $row2.append($numz3);

      var $label5 = $('<p style="border:1px solid; border-color: #6E6E6E;" class="llabel">Profit</p>');
      $test_bet = $('<input style="border:1px solid; border-color: #6E6E6E;" id="pro_fits" value="0" class="readonly"/>');
    var $numz4 = $('<p style="margin-right:15px;border:1px solid; border-color: #6E6E6E;" class="rlabel">฿</p>');
      $row3.append($label5);
      $row3.append($test_bet);
    $row3.append($numz4);

      var $label6 = $('<p style="border:1px solid; border-color: #6E6E6E;" class="llabel">Win %</p>');
      $test_betS = $('<input style="border:1px solid; border-color: #6E6E6E;" id="win_lose" value="0" class="readonly"/>');
    var $numz5 = $('<p style="margin-right:15px;border:1px solid; border-color: #6E6E6E;" class="rlabel">%</p>');
      $row3.append($label6);
      $row3.append($test_betS);
    $row3.append($numz5);

      var $label7 = $('<p style="border:1px solid; border-color: #6E6E6E;" class="llabel">Bets</p>');
      $Bet_amt = $('<input style="border:1px solid; border-color: #6E6E6E;" id="Bet_amt" value="0" class="readonly" />');
    var $numz6 = $('<p style="border:1px solid; border-color: #6E6E6E;" class="rlabel">#</p>');
      $row3.append($label7);
      $row3.append($Bet_amt);
    $row3.append($numz6);

      var $label8 = $('<p style="border:1px solid; border-color: #6E6E6E;" class="llabel">Suggested x</p>');
      $guess_amt = $('<input style="border:1px solid; border-color: #6E6E6E;" id="Guess_amt" value="0" class="readonly" />');
    var $numz7 = $('<p style="border:1px solid; border-color: #6E6E6E;" class="rlabel">x</p>');
      $row2.append($label8);
      $row2.append($guess_amt);
    $row2.append($numz7);
    
      var $label9 = $('<p style="border:1px solid; border-color: #6E6E6E;" class="llabel">Probability</p>');
      $magic_amt = $('<input style="border:1px solid; border-color: #6E6E6E;" id="magic_amt" value="0" class="readonly" />');
    var $numz8 = $('<p style="border:1px solid; border-color: #6E6E6E;" class="rlabel">%</p>');
      $row1.append($label9);
      $row1.append($magic_amt);
    $row1.append($numz8);
    
      var $row4 = $('<div class="row"/>');
      var $label10 = $('<p style="border:1px solid; border-color: #6E6E6E;" class="llabel">Max win</p>');
      $max_win = $('<input style="border:1px solid; border-color: #6E6E6E;" id="max_win" value="0" class="readonly" />');
    var $numz9 = $('<p style="margin-right:15px;border:1px solid; border-color: #6E6E6E;" class="rlabel">#</p>');
      $row4.append($label10);
      $row4.append($max_win);
    $row4.append($numz9);
    
      var $label11 = $('<p style="border:1px solid; border-color: #6E6E6E;" class="llabel">Max loss</p>');
      $max_loss = $('<input style="border:1px solid; border-color: #6E6E6E;" id="max_loss" value="0" class="readonly" />');
    var $numz10 = $('<p style="margin-right:15px;border:1px solid; border-color: #6E6E6E;" class="rlabel">#</p>');
      $row4.append($label11);
      $row4.append($max_loss);
    $row4.append($numz10);

      var $fieldset = $('<fieldset style="background-color:transparent;border:2px solid; border-color: #6E6E6E;"/>');
      $fieldset.append($row1);
      $fieldset.append($row2);
    $fieldset.append($row3);
    $fieldset.append($row4);
    
    var $sound_box = $('<div class="row"/>');
	$sound_c = $('<div><input type="checkbox" value="1" name="sound_check" id="sound_check" checked="checked" /> Beep on win!</div>')
    $sound_box.append($sound_c);
    $row4.append($sound_box);  

      $button_group.append($martingale_button);
      $button_group.append($fieldset);
      $button_group.append($run_div);
      $button_group.append("<div align='center' style='color:white;font-size:8pt;'>---- Nixsy's martingale bot ---- (C) 2013  CriticalNix ---- If you like this consider donating a coffee and pizza ฿:1DKrERTfV7ni1hrhmvCCTbG9xXgERtXsK ----</div>");

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

function appendheaderfooter(){
     var header="<div style='position:fixed;top:0px;background-color:green;'>win</div>";
     var footer="<div style='position:fixed;bottom:0px;background-color:red;'>lose</div>"
     $("body").append(header+footer);
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

      ping_user();

      Gmultiplier();
      
      bust_chance();
    
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

       //set our array list
      chrome.storage.sync.get('ignore', function (val) {
            arr_ignore = val["ignore"].split(',');
            console.log('local storage: ' + val["ignore"]);
          
    });

     $(document).keydown(function (e) {
            var ctrlDown = false;
            var ctrlKey = 17,
        qKey = 81,
        rKey = 82;

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
          
    });

});

(function ($) {

      $.extend({
            playSound : function () {
                  return $("<embed src='" + arguments[0] + "' hidden='true' autostart='true' loop='false' class='playSound'>").appendTo('body');
                
        }
          
    });

})(jQuery);
