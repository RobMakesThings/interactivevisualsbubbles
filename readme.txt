

This project stems from a desire to incorporate crowd participation at shows while doing live visuals. It turned into a great foray into web development with node, as well as deploying the service to 3 major cloud providers. 
Below is some old documentation, I would love to return to this project at some point. 


attributions:
It's basically the same concept as mine. implemented a little differently. 
https://github.com/rfikes4/resolume-interactive-demo/blob/master/public/stage.js


physics example from
https://p5js.org/examples/motion-bouncy-bubbles.html


instead of blend modes, have different animated backgrounds on the stage computer
penrose system- 

particles?
https://p5js.org/examples/simulate-particles.html



overview
[x]--sockets.io for backend
[x]-- p5.js for frontend
[]-- comes in to visual computer through OBS and gets piped into resolume with spout or whatever. 




each client gets options to control or add emoji to screen 



[x]each client gets a random emoji or shape that bounces around
[x]button for blend mode
[ ] button to add shape--- should be able to choose a shape or emoji
[ ] other buttons for effects
[ ] buttons or input for positive messages. 
[ ] GET MOBILE TO WORK

'#'+Math.floor(Math.random()*16777215).toString(16) --- random color

client is made up of a canvas 

buttons do effects like changing background, or the client color.

text boxes? showing text on screen? maybe emoji only chat?

enter a nickname--3Chars-- emojis are best. 


drawing shows on stage computer but not on other clients. 

---- style goals---
[x] z index

[x] bulma on client side

[ ] animated intro with no prompt anymore, more seamless exp. -- using modals  and css transitions?




.... stretch goals

multiple animated backgrounds --- find a random processing sketch?

optimize code to perfrom better 
set interval? dont store anything

figure out how to deploy-- --AWS-- 
[x] heroku https://tonightsvisuals.herokuapp.com/ or https://tonightsvisuals.herokuapp.com/booth/booth.html for booth

[x] google cloud https://crested-acumen-283919.wn.r.appspot.com/ or https://crested-acumen-283919.wn.r.appspot.com/booth/booth.html for booth

[x] AWS at http://tonightsvisuals-env.eba-idbdbiam.us-east-1.elasticbeanstalk.com/

[ ] VPS provider or other cloud service 
