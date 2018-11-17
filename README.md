# media-queries
A media-queries tool on javascript <br><br>
It able to set events by media rule (querystring)
with chain method<br><br> can using callback or appear and disappear dom for RWD that multiple condition from your complicated design!

<h3>simple code</h3>

<br><br>
do nothing<br>

<code>
  new media();
</code>

<br><br>
set mediaQueryString and callback then<br>
will be calling it when window resize width and "matches" be true<br>

<code>
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
</code>

if don't want matches was true to call only,
add true for made event got to do when present invalid

<code>
        .set('(min-width: 992px) and (max-width: 1199.98px)', function () {
          console.log('lg');
        }, true)
</code>


callback parameters include native event<br>
and context is from `new media()` self Object

<code>
    .set('(min-width: 1200px)', function (evt, context) {
      context.getStatus(function (status, context) {
        context.remove(status.querystrings);
      });
    })
</code>

remove event by mediaQueryStrings, like that<br>
type of String or Array

<code>
   .remove([
        '(max-width: 575.98px)',
        '(min-width: 576px) and (max-width: 767.98px)'
    ]);
</code>

how to trigger them on first time (RWD runtime)?

<code>
    .set...
    .set...
    .set...
    .getStatus(function (status, context) {
        context.trigger(status.querystrings); // type of String or Array
    })
</code>

using `.getStatus` can get mediaQueryStrings `querystrings` after set events<br>
get current active mediaQueryStrings `active_querystrings`

<code>
      .getStatus(function (status, context) {
        console.log(status);
        /* status e.g.
            {
                querystrings: ['(max-width: 575.98px)', '(min-width: 1200px)'],
                active_querystrings: ['(max-width: 575.98px)']
            }
        */
      })
</code>

<h4>appear doms</h4>

using `.setAppearing(mediaQueryStrings, dom)` set to appear dom

<code>
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
</code>

how to trigger them to appearing or disappearing on first time (RWD runtime)?<br><br>
using `.getAppearingStatus` and `.triggerAppearingWithMedia`<br>
the `.triggerAppearingWithMedia` is like `.trigger` that just for appearing effect

<code>
    .setAppearing...
    .setAppearing...
    .setAppearing...
    .getAppearingStatus(function (status, context){
      context.triggerAppearingWithMedia(status.querystrings);
    });
</code>

the `.getAppearingStatus` can get mediaQueryStrings `querystrings` after set appearing's events<br>
get current active mediaQueryStrings `active_querystrings`<br><br>
another it can get your all doms, and comments

<code>
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
</code>

default setting dom to appear or disappear by mediaQueryString<br>
using `.appearingEffect(mediaQueryStrings, true || false)`

<code>
    .appearingEffect('(max-width: 575.98px)', false); // set false is disappearing
</code>

<code>
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
</code>

using `.removeAppearing(mediaQueryStrings, domMethod)`<br> to remove appearing event<br><br>
domMethod have two options<br>
`appearing` is always appearing dom after removed event<br><br>
`remove` is always disappearing dom and destroy dom after removed event<br><br>
without domMethod will do `triggerAppearingWithMedia` before removed event<br>

<code>
    .set('(min-width: 1200px)', function (event, context) {
      context.removeAppearing([
        (max-width: 575.98px)',
        '(min-width: 576px) and (max-width: 767.98px)'
      ],
      'remove');
    })
</code>

<code>
    .getAppearingStatus(function (status, context) {
        if (status.querystrings.includes('(min-width: 1920px)')) {
            context.removeAppearing(status.querystrings);
        }
     });
</code>