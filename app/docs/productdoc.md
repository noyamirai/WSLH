# WSLH - Product documentation

For the course "Web App From Scratch" everyone was tasked to design and build a Single Page web App (SPA) based on a user story. The teachers gave us about three weeks for this assignment. The catch is that we had to retrieve data from an external API, manipulate and display said data, but only by using vanilla HTML, CSS and Javascript.

## User Story

As you might already be aware, I developed a football application to keep you up-to-date with your favorite teams in the FA Women's Super League. I have enjoyed football for as long as I can remember, I was practically raised in a Galatasaray household where we watched games with the family every weekend. To no one's surprised, I ended up playing football myself as well, however I never actually joined a team. I played on the streets with my friends and occasionaly went to a local club to use their pitches.

Back then, women's football was not really a thing, or at least where I lived it was not common for young girls to play football. I never questioned why women's football was not a thing, children were raised with the idea that football is a boys sport only. And I feel like, to this day, quite a lot of people still have this exact same mentality when it comes to football, or just sports in general. Only recently did I get a glimpse of women's football: Women's Football World Cup of 2019. The Netherlands reached the semi-finals and was up against the United States. I personally feel like after that specific World Cup people started paying attention and became more aware of women's footbal. 

This year I wanted to *really* get into women's football. I quickly learned how inaccessible women's football is. Talking about the inaccessibility of women's football is a topic on it's own. But I wanted to create something to help others, and myself, keep up-to-date with their favorite teams. Yes, plenty of football apps exists, but none of them focus on women's football! So, for this assignment I came up with a women's football related user story to build my app around:

> "As a Women's Super League enjoyer, I want to be able to quickly view the latest standings of the league, get to know all the teams and see when their next games will be played, so that I can stay up-to-date on the league and the teams"

As you can read in the user story I decided to focus on the FA Women's Super League (WSL), which is the female equivalant of the English Premier League. The WSL is one of the more popular women's football leagues out there. Women's football is popular in the United states, however due to timezone differrences my desire to keep up with their leagues is non existent. The WSL and Liga F are currently the only leagues (for me) that are most accessible. I personally find Liga F to not interest me as much as the WSL; FC Barcelona pretty much dominates Liga F, meaning they win all games and are always #1 on the standings. The WSL appears to be more diverse when it comes to teams (performance wise, at least to me), and overall their games get broadcasted, which is why I chose to focus on WSL for now.

## Choosing an API

Before I picked this user story I browsed the web for free REST APIs with live football data. Not a lot of options for us football and coding enjoyers out there... Most of the APIs were amazing, don't get me wrong, but the issue was that they would either require you to sign up for a payment plan in order to receive a key, or they would only allow a certain amount of API calls per month.  

After scrolling through Google for a while I ended up finding a rather charming API, made by developers who enjoy sports: [TheSportsDB](https://thesportsdb.com/)! As their site describes, TheSportsDB website is a collection of metadata, artwork, results and tables that has a JSON API. The site was built in 2015 to serve a need for a common interface of sports data for various Home Theatre Applications. Since then it has grown into one of the largest free sports databases on the net.

It offers several free API endpoints, so I experimented with those first and found they suited my needs. As I kept on developing, I wanted more features, so I ended up subscribing to their Patreon for €5,50 in order to receive a key (cheap and worth it! especially in comparison to other APIs).

## Initial interface

Once I knew creating this app with TheSportsDB would be possible, I had to figure out what the app was going to look like visually. I drew up a few sketches; I knew the core of the app was displaying relevant data to the user, so I first and foremost needed a landing page, standings overview and team details.

<!-- TOOD: image of sketches -->

After finishing these sketches I created a wireflow, to serve as a visual representation of how users would be interacting with the app and how the app would respond to certain interactions

![WSLH Wireflow](./assets/WSLH-wireflow.png)

Since the assignment was to create a Single Page web App, I quickly came to the conclusion that every page would be a `<article>` to create a clear structure in HTML.