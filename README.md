# cgmsim
CGM trace generator 
===================
This little application is simulating in an extremely basic way the effects food and insulin analogs on continuous glucose monitor (CGM) curve in type 1 diabetes (T1D). It uses Nightscout as an input and visualization method.
Since even accurate physiological simulators can at best provide only an approximation of what happens in a biological organism, the goal is not even to try to match reality, but to provide a tool helping to visualize the fluctuations of glucose sensor values in response to various insulin analogs and food. 
The simulation can be used as a learning and practicing tool, with a goal of keeping the CGM curve values as much of possible in certain range. The target range is 3.9 – 10 mmol/l or 70-180 mg/dl, and the target Time In Range (TIR) is 70%.

To understand the mechanics of such a simulation, just a few things must be considered.
a)	The liver releases glucose into the bloodstream by either releasing its stores (glycogenolysis) or synthesizing new glucose from amino acids (gluconeogenesis). This is called the endogenous glucose production (EGP), and various biological states can affect it (not only alcohol!).

b)	The ingestion of food and the digestion and absorption of carbohydrates will also increase the blood glucose. After a short delay, the CGM will reflect the increase of blood glucose.

c)	This tool does not (yet) model the effect of exercise.

d)	Mealtime insulins have a short duration of activity (DIA -around 3 hours), while basal insulins are meant to be injected once or twice a day, and hence have a much longer duration of activity. 

Modeling the activity of mealtime insulin activities (aspart, lispro and glulisine) has been done extensively, and the model provided here :
(https://github.com/LoopKit/Loop/issues/388#issuecomment-317938473 )

Modeling the activities of the long-acting agonists detemir and glargine instead, is still lacking. Based on clamp studies in T1D, the intra-individual, day-to-day variation is an important factor affecting the predictability of a single repeated dose. Moreover, the inter-individual variability makes modeling a challenge. Even with the best curve-fitting tools, no “global model” was achieved.

Since the goal is not to make a perfect model, I decided to use a sinusoidal curve to model detemir, and a half-ellipse for glargine. The obvious reasons are that the mathematics are simple. 

Modeling Levemir (Levemir®)
============================
The clamp studies show that the dose-response curve is linear. With increasing doses from 0.1U/kg to 1.6U/kg, the total activity, or area under the curve (AUC) of the glucose infusion rate (GIR) needed to maintain normal blood glucose is a straight line.
 
![image](https://user-images.githubusercontent.com/18611419/109794079-26fe5f80-7c1e-11eb-916c-3944d259f2a3.png)
 
However, the DIA seems related to the dose/kg, so that had to be considered in the model. The AUC precisely reflects the injected number of units and is identical for 12U @0.1U/kg and 12U @0.4U/kg.
However, when increasing the do dose from 12U @0.4U/kg to 24U @0.4U/kg, you can see that the DIA increases:

![image](https://user-images.githubusercontent.com/18611419/109794111-3382b800-7c1e-11eb-92b6-b04351691c5f.png)


Duration of Levemir action = 16 + (20*U/weight)
So for 0.1 U/kg, the duration of action is 16+(20*0.1) = 18 hours, and for 0.4U/kg, the DIA is 16+(20*0.4) = 24 hours.

And the model itself is:
y= units*(Math.PI/(duration*2))*(Math.sin(time*Math.PI/duration));

Modeling Glargine (Lantus®, Abasaglar®, Toujeo®)
================================================
For the time being, only glargine U100 is basically modeled here, with a DIA of 27 hours. Again, the AUC reflects the injected dose.

![image](https://user-images.githubusercontent.com/18611419/109794202-4c8b6900-7c1e-11eb-9c47-69054578e68f.png)

I “chopped” the equation in little bits fo clarity :
b = (2*basalDose)/(Math.PI*duration);  // duration is 27 hours
x = (Date.now() - time0)/(60*60*1000); //time0 is the time of injection
g = x-(duration/2);
gg = Math.pow(g,2);
h = duration/2;
hh= Math.pow(h,2);
z = (x-gg)/hh;
bb = Math.pow(b,2);

y = 2*Math.sqrt(bb*(1+z)); // where y is the activity of glargine over time


Here is a visual aid illustrating the differences between the activity curves of detemir and glargine at different doses:
 
![image](https://user-images.githubusercontent.com/18611419/109794249-5745fe00-7c1e-11eb-9d94-839c4a34d706.png)
