# media-queries
A media-queries tool on javascript <br><br>
It able to set events by media rule (querystring)
with chain method<br><br> can using callback or appear and disappear dom for RWD that multiple condition from your complicated design!

<h3>simple code</h3>

<br><br>
do nothing<br>

````
  new media();
````
<br><br>
set mediaQueryString and callback then<br>
will be call when window resize width and "matches"<br>
````
  new media()
        .set('(max-width: 575.98px)', function () {
          console.log('xs');
        })
        .set('(min-width: 576px) and (max-width: 767.98px)', function () {
          console.log('sm');
        })
        .set('(min-width: 768px) and (max-width: 991.98px)', function () {
          console.log('md');
        })
        .set('(min-width: 992px) and (max-width: 1199.98px)', function () {
          console.log('lg');
        })
        .set('(min-width: 1200px)', function () {
          console.log('xl');
        });
````

if don't want matches to call only,
add true for includes got present invalid to do
````
        .set('(min-width: 992px) and (max-width: 1199.98px)', function () {
          console.log('lg');
        }, true)
````


callback parameters includes native event<br>
and context is new media() Object

````
    .set('(min-width: 1200px)', function (evt, context) {

      context.getStatus(function (status, context) {
        context.remove(status.querystrings);
      });
    })
````
removes event by mediaQueryStrings, like that<br>
type of String or Array
````
   .remove([
        '(max-width: 575.98px)',
        '(min-width: 576px) and (max-width: 767.98px)'
    ]);

````

how to trigger them on first time (RWD runtime)?
````
    .set...
    .set...
    .set...
    .getStatus(function (status, context) {
        context.trigger(status.querystrings); // type of String or Array
    })
````

the getStatus can get mediaQueryStrings (querystrings) after set events<br>
get current active mediaQueryStrings (active_querystrings)
````
      .getStatus(function (status, context) {
        console.log(status);
        /* status e.g.
            {
                querystrings: ['(max-width: 575.98px)', '(min-width: 1200px)'],
                active_querystrings: ['(max-width: 575.98px)']
            }
        */
      })
````

<h4>appear doms</h4>

setAppearing(mediaQueryStrings, dom)
````
  new media()
    .setAppearing("(max-width: 575.98px)", document.getElementById('demo-5'))
    .setAppearing("(min-width: 576px) and (max-width: 767.98px)", [
       document.getElementById('demo-5'),
       document.getElementById('demo-4')
     ])
    .setAppearing("(min-width: 768px) and (max-width: 991.98px)", [
       document.getElementById('demo-5'),
      document.getElementById('demo-4'),
      document.getElementById('demo-3')
     ])
    .setAppearing("(min-width: 992px) and (max-width: 1199.98px)", [
      document.getElementById('demo-5'),
      document.getElementById('demo-4'), 
      document.getElementById('demo-3'),
      document.getElementById('demo-2')
    ])
````
how to trigger them to appearing or disappearing on first time (RWD runtime)?<br><br>
using getAppearingStatus and triggerAppearingWithMedia<br>
the .triggerAppearingWithMedia is like .trigger that just for appearing effect

````
    .setAppearing...
    .setAppearing...
    .setAppearing...
    .getAppearingStatus(function (status, context){
      context.triggerAppearingWithMedia(status.querystrings);
    });
````

the getAppearingStatus can get mediaQueryStrings (querystrings) after set appearing's events<br>
get current active mediaQueryStrings (active_querystrings)<br><br>
another it can get your all doms, and comments
````
    .getAppearingStatus(function (status, context) {
      console.log(status);
      /* status e.g.
          {
              querystrings: ['(max-width: 575.98px)', '(min-width: 1200px)'],
              active_querystrings: ['(max-width: 575.98px)'],
              doms: []
          }
      */
    })
````

default setting dom to appear or disappear by mediaQueryString<br>
using appearingEffect(mediaQueryStrings, true || false)

````
    .appearingEffect('(max-width: 575.98px)', false); // set false is disappearing
````

````
    /*
        status.querystrings = [
            '(max-width: 575.98px)',
            '(min-width: 576px) and (max-width: 767.98px)',
            '(min-width: 768px) and (max-width: 991.98px)',
            ...
            ...
        ]
    */

    .getAppearingStatus(function (status, context){
      context.appearingEffect(status.querystrings,  true); // appear all
    });
````