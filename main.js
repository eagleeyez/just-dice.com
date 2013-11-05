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
//The creation of this bot.                                          
//                                                                   
//Peace                                                              
//Nix                                                                
//                                                                   
//-------------------------------------------------------------------
//            Added a simple licence To ensure freedoms.
//-------------------------------------------------------------------
//            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
//                    Version 2, December 2004
//
// Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>
//
// Everyone is permitted to copy and distribute verbatim or modified
// copies of this license document, and changing it is allowed as long
// as the name is changed.
//
//            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
//   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
//
//  0. You just DO WHAT THE FUCK YOU WANT TO.
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
var lastBal = 0; //balance that is grabbed in checkstep
var yin_yang = 0; //counting wins
var yin_yang2 = 0; //percentage of rolls that are wins
var check_step = 0; //Simple switch to make sure we grab the balance once
var bet_total = 0; //Total bets =)


// Extra buttons found on pastebin http://pastebin.com/n8X8uRAT Originally from a user called "v" and edited by another unknown user.

$('.button_inner_group:nth(2)').append(
      '<button onClick=\'javascript:socket.emit("invest_box", csrf); socket.emit("invest", csrf, "all", $("#invest_code").val());\'>invest all<div class="key">J</div></button>').append(
      '<button onClick=\'javascript:socket.emit("invest_box", csrf); socket.emit("divest", csrf, "all", $("#divest_code").val());\'>divest all<div class="key">K</div></button>');

var usdCache = 0;
var usdCacheAge = 0;
function cacheUSD(){
	if(usdCacheAge < new Date().getTime() - 60000){
		$.ajax("https://api.bitcoinaverage.com/all", {success:function(data){
			usdCache = data;
		}});
		usdCacheAge = new Date().getTime();
	}
}
function updateUSD(){
		$(".investmentUSD").html((parseFloat($(".investment").html()) * usdCache[$("#currencySelector").val()]["averages"]["24h_avg"]).toFixed(2) + " " + $("#currencySelector").val());
		$(".invest_pftUSD").html((parseFloat($(".invest_pft").html()) * usdCache[$("#currencySelector").val()]["averages"]["24h_avg"]).toFixed(2) + " " + $("#currencySelector").val());
		$(".myprofitUSD").html((parseFloat($(".myprofit").html()) * usdCache[$("#currencySelector").val()]["averages"]["24h_avg"]).toFixed(2) + " " + $("#currencySelector").val());
		$(".wageredUSD").html((parseFloat($(".wagered").html()) * usdCache[$("#currencySelector").val()]["averages"]["24h_avg"]).toFixed(2) + " " + $("#currencySelector").val());
		$("#pct_balanceUSD").val(($("#pct_balance").val() * usdCache[$("#currencySelector").val()]["averages"]["24h_avg"]).toFixed(2) + " " + $("#currencySelector").val());
}

var losses = 0;
var lastWin = new Date().getTime();
var profitPerMS = 0;

function martingale() 
{
        setTimeout(updateUSD, 1);
                
  if (bal.data('oldVal') != bal.val() && running) {
    clearInterval(timer);

    var curr_bal = bal.val();
// add a single step to grab starting balance
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

            yin_yang2 = ((yin_yang/bet_total) * 100); //win % = wins/total bets * 100 // This gives us our percentage win

            //get rid of scientific notation
            if (String(new_val).indexOf('e') !== -1) {
                var arr = new Array();
                arr = String(new_val).split('e');
                  new_val = new_val.toFixed(arr[1].substring(1));
                console.log('new_val='  +new_val);
            }

            
            $("#pct_bet").val(new_val);

            //Increase the steps
            current_steps = 1;
            current_steps++;
            //yin_yang--;
			bet_total++;
            //current_bet_num = 1;
            $("#a_hi").trigger('click');
            $("#win_lose").val((yin_yang2).toFixed(2)); //Update win %
			$("#pro_fits").val((profit).toFixed(8)); //Update Profit
			$("#Bet_amt").val(bet_total); //Update bet counter
        }    //end of reset loss step

   else if (curr_bal > bal.data('oldVal')) //This is win step
    {
        current_steps = 1;
        current_bet_num = 0;
        $("#pct_bet").val(start_bet);
            //Increase our bet by the multiplier
            var profit = parseFloat($("#pct_balance").val()) - lastBal;
            var new_val = $("#pct_bet").val(); // Why I had left a multiplyer here.. Madness Fixed now.

            yin_yang2 = ((yin_yang/bet_total) * 100); //win % = wins/total bets * 100 // This gives us our percentage win

            //get rid of scientific notation
            if (String(new_val).indexOf('e') !== -1) {
                var arr = new Array();
                arr = String(new_val).split('e');
                  new_val = new_val.toFixed(arr[1].substring(1));
                console.log('new_val='  +new_val);
            }

            
            $("#pct_bet").val(new_val);
            $("#win_lose").val(yin_yang);

            //Increase the steps
            current_steps++;
            current_bet_num++;
			yin_yang++;
			bet_total++;
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

            yin_yang2 = ((yin_yang/bet_total) * 100); //win % = wins/total bets * 100 // This gives us our percentage win

            //get rid of scientific notation
            if (String(new_val).indexOf('e') !== -1) {
                var arr = new Array();
                arr = String(new_val).split('e');
                  new_val = new_val.toFixed(arr[1].substring(1));
                console.log('new_val='  +new_val);
            }

            
            $("#pct_bet").val(new_val);
            $("#win_lose").val((yin_yang2).toFixed(2)); //Update win %
			$("#pro_fits").val((profit).toFixed(8)); //Update Profit
			$("#Bet_amt").val(bet_total); //Update bet counter

            //Increase the steps
            current_steps++;
            current_bet_num++;
			//yin_yang--;
			bet_total++;
            $("#a_hi").trigger('click');
    } //end of loss step

    //otherwise we go back to the start
    else {  //This is bust step

      yin_yang2 = ((yin_yang/bet_total) * 100); //win % = wins/total bets * 100 // This gives us our percentage win
      current_steps = 1;
      current_bet_num = 0;
      $("#pct_bet").val(start_bet);
      $("#win_lose").val((yin_yang2).toFixed(2));
	  $("#pro_fits").val((profit).toFixed(8));
      running = false;
    } //end of bust step

    // Updated stored value
    bal.data('oldVal', bal.val());
    timer = setInterval(function() { martingale() },timer_num);

  }

  else bal.data('oldVal', bal.val());
  
}

// A little bit of a help file.
function tabber() {
        var markup = '<div class="bot-stats"><div>Hi Guys and girls thankyou for taking the time to try or use this automated betting system. My name is (98066)Nix You can usually find me right here in the chat on JD. If you need to ask anything feel free to, I will help all I can.<div></div> It has been a lot of fun learning some javascript and it is even more fun trying out new ways (I know trying.) to beat the house at JD.<div></div> If you win loads or just like this bot consider donating a coffee and a pizza =) 1NixsyLiMFX3wwLqdtAVsNLsWwqDpbmuhP  </div><h3>Multiplyer</h3><div>This is a value used to increase bet on loss eg. 2x multiplier will double your bet on a loss</div><div class="clear"></div><h3>Max losses</h3><div>This is the amount of consecutive losses you want the bot to be able to handle, The bot will stop upon reaching a loss streak of this length unless Reset loss is a smaller number</div><h3>Reset loss</h3><div>This is a relatively new feature to martingale. Upon a loss streak reaching this number. the bet value will change to value given in Reset %</div><h3>Reset %</h3><div>This value is called when Reset loss is reached. This value is a percentage of your total bank. Use extreme caution when setting high numbers here.</div><h3>Profit display</h3><div>This will show your profit won. If you refresh the page this value will reset.</div><h3>Win % display</h3><div>This will show wins as a percentage of rolls. You can expect this number to be very close to chance to win</div><h3>Credits</h3><div>I would like to thank Darby999 for his original script. he was laid up in bed with a broken hip in spring this year and the origins of this script was born. I would also like to thank TSavo as without him The currency converter would not exist.</div><h3></h3><div></div><h3>A word of warning</h3><div>Any sort of automated betting system will ultimately contain bugs. Do not ever have more in your balance than you are willing to lose and always use google two factor authentication.</div><div class="clear"></div><div class="bot-graph">Check here for updates and new changes https://github.com/CriticalNix/just-dice.com</div><div class="bot-foot">';
                $panelWrapper = $('<div>').attr('id','Nixsy9').css({display: 'none'}).insertAfter('#faq'),
                $panel = $('<div>').addClass('panel').append(markup).appendTo($panelWrapper),
                                
                                $s_bet = $('#gbs_bet')
       

        $('<li>').append($('<a>').text('Bot-Help').attr('href','#Nixsy9')).appendTo('.tabs');
};

function ping_user() {

  var log = $(".chatlog");
  log.data('oldVal',log.html());
  log.data('length',0);
  setInterval(function() { 
       
        var new_str = log.html();
        var arr = new Array();
        arr = new_str.split('<br>');
          if (log.data('length') != arr.length || log.data('length')===101) {

          var depth;
          if (log.data('length') === 101) {console.log('here'); depth = 0;}
          else depth = arr.length - 2;


          //if this is the first time we'll look at every line, 
          //otherwise we'll just do the last (which is arr.length - 2)
          for(var line_count=depth; line_count < arr.length - 1; line_count++)
          {

            var line = arr[line_count];
            if (typeof line !== 'undefined') {

                var line_items = line.split(' ');
                var username = $('#login span:first-child').text();
                var pos = line_items.indexOf(username,3);
                if (pos >=0) {
                    line_items[pos] = line_items[pos].replace(username,
                        '<span style="color:red;font-weight:bold;">' + username + '</span>');

                    var new_line = line_items.join(' ');
                    arr[line_count] = new_line;
                }

                //ignore
                var i;
                for(i=0;i<arr_ignore.length ;i++) {
                    var ignore_user = '&lt;' + arr_ignore[i] + '&gt;';
                    var ignore_pos = line_items.indexOf(ignore_user,2);
                    console.log('target:' +  line_items[2]);
                    if (ignore_pos > -1)  arr[line_count] = 'ignored';
                }
            } //if undefined
          }  //for

          var new_log = arr.join('<br>');
          log.html( new_log);
              log.data('length', arr.length);
          console.log('length: ' + arr.length);
          $.playSound('notify.wav');
        }
   },100);
}

function create_ui() {

  var $container = $('<div class="container"/>');
  var $container2 = $('<div class="container"/>');
  var $button_group = $('<div class="button_group"/>');
  $container.append($button_group); 
  
  var $martingale_button = $('<button class="button_label chance_toggle" style="margin-top:20px;">Nixsy5</button>');

  var $run_div = $('<div class="button_inner_group"/>');
  $run = $('<button id="c_run" style="margin-top:5px;">Start<div class="key">R</div></button>');

  $run.click(function() { 
        running = true; 
  start_bet =  $("#pct_bet").val();
  $("#a_hi").trigger('click');
  });
  $run_div.append($run);

  StartBalance = parseFloat($("#pct_balance").val()); // Try to add profit readout
    
  $Stop = $('<button id="c_stop" style="margin-top:5px;">Stop<div class="key">Q</div></button>');
  $Stop.click(function() {
  running = false;
  });
  $run_div.append($Stop);
  
  var $row1 = $('<div class="row"/>');
  var $label1 = $('<p class="llabel">Multiplier</p>');
  $multiplier = $('<input id="multiplier" value="2.1"/>');
  $multiplier.keyup(function() {set_run();});
  var $x = $('<p class="rlabel">x</p>');
  $row1.append($label1);
  $row1.append($multiplier);
  $row1.append($x);

  var $row2 = $('<div class="row"/>');
  var $label2 = $('<p class="llabel">Max losses</p>');
  $steps = $('<input id="steps" value="17"/>');
  $steps.keyup(function() {set_run();});
  var $numz = $('<p class="rlabel">#</p>');
  $row2.append($label2);
  $row2.append($steps);
  $row2.append($numz);
 
  var $row3 = $('<div class="row"/>'); 
  var $label3 = $('<p class="llabel">Reset loss</p>');
  $delay = $('<input id="updateInterval" value="16"/>');
  var $numz2 = $('<p class="rlabel">!</p>');
  $row1.append($label3);
  $row1.append($delay);
  $row1.append($numz2);
  
  var $label4 = $('<p class="llabel">Reset %</p>');
  $percentage = $('<input id="updateInterval" value="1"/>');
  var $numz3 = $('<p class="rlabel">%</p>');
  $row2.append($label4);
  $row2.append($percentage);
  $row2.append($numz3);
  
  var $label5 = $('<p class="llabel">Profit</p>');
  $test_bet = $('<input id="pro_fits" value="0" class="readonly"/>');
  var $numz4 = $('<p class="rlabel">฿</p>');
  $row3.append($label5);
  $row3.append($test_bet);
  $row3.append($numz4);

  var $label6 = $('<p class="llabel">Win %</p>');
  $test_betS = $('<input id="win_lose" value="0" class="readonly"/>');
  var $numz5 = $('<p class="rlabel">%</p>');
  $row3.append($label6);
  $row3.append($test_betS);
  $row3.append($numz5);
  
  var $label7 = $('<p class="llabel">Bets</p>');
  $Bet_amt = $('<input id="Bet_amt" value="0" class="readonly"/>');
  var $numz6 = $('<p class="rlabel">#</p>');
  $row3.append($label7);
  $row3.append($Bet_amt);
  $row3.append($numz6);

  var $fieldset = $('<fieldset/>');
  $fieldset.append($row1);
  $fieldset.append($row2);
  $fieldset.append($row3);

  //$button_group.append($martingale_button);
  $button_group.append($fieldset);
  $button_group.append($run_div);

  $(".container").eq('1').append($container);
  $(".container").eq('1').append('<div style="clear:left;"/>');

  $.ajax("https://api.bitcoinaverage.com/all", {success:function(data){
		//usdCache = parseFloat(data.USD.averages["24h_avg"]);
	currencyOptions = "";
	for(i in data){
		if(i=="USD"){
			currencyOptions += "<option value=\"" + i + "\" SELECTED>" + i + "</option>";
			
		}else if(i.length == 3){
			currencyOptions += "<option value=\"" + i + "\">" + i + "</option>";
		}
	}
	$(".chatstat table tbody").append(
			'<tr><th><select id="currencySelector">' + currencyOptions + '</select></th><td><span class="investmentUSD"></span></td><td><span class="invest_pftUSD"></span></td><td></td><td><span class="profitPerSUSD"></span></td><td><span class="wageredUSD"></span></td><td><span class="myprofitUSD"></span></td></tr>'		
	);
	setTimeout(updateUSD,5000);
  }});
  $(".balance").append('<br><input id="pct_balanceUSD" class="readonly" tabindex="-1">');
  
}

function set_run() {
  if ($multiplier !== undefined &&
      $steps !== undefined   )
      if ( $.isNumeric($multiplier.val()) && 
           $.isNumeric($steps.val()) &&
           $.isNumeric($('#pct_bet').val())) {

           var total = 0;
           var mult = 1;
           var i;
          console.log('steps: ' + $steps.val() +  
          '   multiplier:' + $multiplier.val() +
          '   bal: ' + $('#pct_balance').val() + 
          '   bet:' + $('#pct_bet').val());

           for(i=0;i<$steps.val();i++) {
             total+= $('#pct_bet').val() * mult;
             mult *= $multiplier.val(); 
           }
           console.log('total:' + total);

           if (total != 0 && total < $('#pct_balance').val()) {
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
$(document).ready( function() {

  tabber();

  console.log('starting');

  create_ui();

  ping_user();
  
  //drawchart();
  cacheUSD();
  setInterval(cacheUSD, 60000);
  setTimeout(updateUSD,5000);
  

  //set the balance
  //when the balance changes and we're martingaling 
  //we'll do our stuff
  bal = $("#pct_balance");
  bal.data('oldVal', bal.val());
  timer = setInterval(function() { martingale() },timer_num);

  //we also monitor the bet b/c it can also determine if 
  //we have enough btc to bet the martingale run
  bet = $("#pct_bet");
  bet.data('oldVal',bet.val());
  setInterval(function() { 
          if (bet.data('oldVal') != bet.val() && !running) {
              bet.data('oldVal', bet.val());
          set_run();
        }
   },100);

  //set our array list
  chrome.storage.sync.get('ignore',function(val) {
    arr_ignore = val["ignore"].split(',');
    console.log('local storage: ' + val["ignore"]);
  });

 $(document).keydown(function(e){
    var ctrlDown = false;
    var ctrlKey = 17, qKey = 81,rKey = 82;

    if (! $(document.activeElement).is('input') &&
      (e.keyCode == rKey)) {
        running = true;        
        start_bet =  $("#pct_bet").val();
        $("#a_hi").trigger('click');
    }

    $(document).keydown(function(e)
    {
        if (e.keyCode == ctrlKey) ctrlDown = true;
    }).keyup(function(e)
    {
        if (e.keyCode == ctrlKey) ctrlDown = false;
    });

    if (ctrlDown && (e.keyCode == qKey)) {
      clearInterval(timer);
      running = false;
      current_steps = 1;
    }
  });

});

(function($){

  $.extend({
    playSound: function(){
      return $("<embed src='"+arguments[0]+"' hidden='true' autostart='true' loop='false' class='playSound'>").appendTo('body');
    }
  });

})(jQuery);
