/*----------------------------------------Global Variables*/
const baseURL = "https://api.scryfall.com/cards/random?q=set:thb ft:/.+/";
const catArray = "https://api.scryfall.com/catalog/card-names";
var card1 = [];
var cardNames = [];
var newScore = 5;
var decrement = 1;
var callId = "";
var scoreElement = document.getElementById('scoreNum');
var lifeElement = document.getElementById('livesNum');
var storedCardNames = JSON.parse(localStorage.getItem("cardNames"));
/*----------------------------------------Standard Functions*/
/*--------------------Data Functions*/

function getCatData() {

    var xhr = new XMLHttpRequest();

    xhr.open("GET", catArray);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var catCards = JSON.parse(this.responseText);
            cardNames = catCards.data;
            localStorage.setItem("cardNames", JSON.stringify(cardNames));
        };
    };
};

function getData(cb) {

    var xhr = new XMLHttpRequest();

    xhr.open("GET", baseURL);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            cb(JSON.parse(this.responseText));
        }
    };
}

function printData(data) {
    $("#newGameCanvas").fadeOut(1000);
    console.dir(data);
    $('#flavourTextData').html(data.flavor_text);
    card1 = [];
    card1.push(data.name, data.flavor_text, data.colors, data.type_line, data.cmc, data.image_uris.normal);
    console.log(card1);
}

/*--------------------Called Functions*/

function functionAlert(msg, myYes) {
    var confirmBox = $("#confirm");
    confirmBox.find(".message").text(msg);
    confirmBox.find(".yes").unbind().click(function () {
        confirmBox.hide();
    });
    confirmBox.find(".yes").click(myYes);
    confirmBox.show();
}

/*----------------------------------------onClick Functions*/

$("#newGameButton").click(function () {
    $("#newGameCanvas").fadeIn(1000);
})

$(".startButton").click(function guessTheCard(name) {

    var callID = $(this).attr("id");
    console.log(callID);
    if (callID == "newGameYes") {
        $(".stickyButton").removeAttr("disabled");
        $("#scoreNum").html(3);
        $("#livesNum").html(5);
        $(".clueButton").fadeIn(1000);
        $("#clue1").removeClass(card1[2]);
        getData(printData);
    } else if (callID == "guessSub") {

        var name = $("#guessInput").val();
        var score = $("#scoreNum").html();
        var life = $("#livesNum").html();

        if (name == "") {
            functionAlert();
            return;
        } else {
            if (name == card1[0]) {
                $("#scoreNum").html(Number(score) + newScore);
                $("#scoreNum").addClass("flashUp");
                $("#flavourTextCol").addClass("flashUp");
                $("#guessInput").val("");
                $("#clue1").removeClass(card1[2]);
                $(".clueButton").fadeIn(1000);
                setTimeout(function () {
                    $("#scoreNum").removeClass("flashUp");
                    $("#flavourTextCol").removeClass("flashUp");
                }, 1000);
                getData(printData);
            } else {
                $("#livesNum").html(Number(life) - decrement);
                $("#livesNum").addClass("flashDown");
                $("#flavourTextCol").addClass("flashDown");
                $("#guessInput").val("");
                $("#clue1").removeClass(card1[2]);
                $(".clueButton").fadeIn(1000);
                setTimeout(function () {
                    $("#livesNum").removeClass("flashDown");
                    $("#flavourTextCol").removeClass("flashDown");
                }, 1000)
                getData(printData);
            };
        };
    };
});

$(".clueButton").click(function () {

    var score = $("#scoreNum").html();

    if ($(this).attr("id") == "cButton1") {
        $("#clue1").addClass(card1[2]);
        $(this).fadeOut(1000);
        $("#scoreNum").html(Number(score) - decrement);
        $("#scoreNum").addClass("flashDown");
        setTimeout(function () {
            $("#scoreNum").removeClass("flashDown");
        }, 1000)
    } else {
        console.log("No!");
    };
});

/*----------------------------------------Listeners*/

window.addEventListener('load', function () {
    var scoreElement = document.getElementById('scoreNum');

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(myFunction);
    observer.observe(scoreElement, {
        childList: true
    });

    function myFunction() {
        if (scoreElement.innerHTML == 0) {
            $(".clueButton").addClass("cannotAfford");
            $(".clueButton").attr("disabled", true);
            $(".clueButton").html("Score point to buy more clues!");
        } else if (scoreElement.innerHTML > 0) {
            $(".clueButton").removeClass("cannotAfford");
            $(".clueButton").attr("disabled", false);
            $("#cButton1").html("Reveal Card Colour");
            $("#cButton2").html("Reveal Converted Mana Cost");
            $("#cButton3").html("Reveal Card Type");
        }
    }

});

/*----------------------------------------Document Ready*/

$(document).ready(function () {

    getCatData();

});

/*----------------------------------------External Code*/
/*--------------------From w3schools*/

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}

autocomplete(document.getElementById("guessInput"), storedCardNames);
/*--------------------From w3schools*/


