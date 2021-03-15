SOME files are not included here, as the code is being updated elsewhere first. Be patient  :)

THIS WILL NEED SOME FORMATTING, sorry for the mathematical formulas in their current state ! 

CGM trace generator 
===================
This application is simulating in an extremely basic way the effects food and insulin analogs on continuous glucose monitor (CGM) curve in type 1 diabetes (T1D). It uses Nightscout (NS) as an input and visualization method.

Since even accurate physiological simulators can at best provide only an approximation of what happens in a biological organism, the goal is not even to try to match reality, but to provide a tool helping to visualize the fluctuations of glucose sensor values in response to various insulin analogs and food. 
The simulation can be used as a learning and practicing tool, with a goal of keeping the CGM curve values as much of possible in certain range. The target range is 3.9 – 10 mmol/l or 70-180 mg/dl, and the target Time In Range (TIR) is 70%.

To understand the mechanics of such a simulation, just a few things must be considered.
a)	The liver releases glucose into the bloodstream by either releasing its stores (glycogenolysis) or synthesizing new glucose from amino acids (gluconeogenesis). This is called the endogenous glucose production (EGP), and various biological states can affect it (not only alcohol!).

b)	The ingestion of food and the digestion and absorption of carbohydrates will also increase the blood glucose. After a short delay, the CGM will reflect the increase of blood glucose.

c)	This tool does not (yet) model the effect of exercise.

d)	Mealtime insulins have a short duration of activity (DIA -around 3 hours), while basal insulins are meant to be injected once or twice a day, and hence have a much longer duration of activity. 


Modeling the activity of mealtime insulins
=========================================
This has been done has been done extensively for aspart, lispro and glulisine, and the model provided here: (https://github.com/LoopKit/Loop/issues/388#issuecomment-317938473 ). This is the model I use to compute the activity of each mealtime insulin dose (called "bolus" from now on). I selected a peak time of 75 minutes and a DIA of 300 min. Please notice that these are variable needed for and used by the mathematical model, and do not always reflect the perception of the duration of activity of a single dose. They can be easily modified in the code, should the user prefer a shorter time to peak, e.g. for faster aspart insulin Fiasp®.


Modeling the activities of the long-acting agonists
===================================================
For detemir and glargine instead, models are still lacking. Based on clamp studies in T1D, the intra-individual, day-to-day variation is an important factor affecting the predictability of a single repeated dose. Moreover, the inter-individual variability makes modeling a challenge. Even with the best curve-fitting tools, no “global model” was achieved.

Since the goal is not to make a perfect model, I decided to use a sinusoidal curve to model detemir, and a half-ellipse for glargine. The obvious reasons are that the mathematics are simple. 


Modeling Levemir (Levemir®)
============================
The clamp studies show that the dose-response curve is linear. With increasing doses from 0.1U/kg to 1.6U/kg, the total activity, or area under the curve (AUC) of the glucose infusion rate (GIR) needed to maintain normal blood glucose is a straight line.
 
![image](https://user-images.githubusercontent.com/18611419/109794079-26fe5f80-7c1e-11eb-916c-3944d259f2a3.png)
 
However, the DIA seems related to the dose/kg, so that had to be considered in the model. The AUC precisely reflects the injected number of units and is identical for 12U @0.1U/kg and 12U @0.4U/kg.
However, when increasing the do dose from 12U @0.4U/kg to 24U @0.4U/kg, you can see that the DIA increases:

![image](https://user-images.githubusercontent.com/18611419/109794111-3382b800-7c1e-11eb-92b6-b04351691c5f.png)


Duration of Levemir action = 16 + (20 * U/weight)
So for 0.1 U/kg, the duration of action is 16+(20 * 0.1) = 18 hours, and for 0.4U/kg, the DIA is 16+(20 * 0.4) = 24 hours.

And the model itself is:
y= units * (Math.PI/(duration * 2)) * (Math.sin(time * Math.PI/duration));


Modeling Glargine (Lantus®, Abasaglar®, Toujeo®)
================================================
For the time being, only glargine U100 is basically modeled here, with a DIA of 27 hours. Again, the AUC reflects the injected dose.

![image](https://user-images.githubusercontent.com/18611419/109794202-4c8b6900-7c1e-11eb-9c47-69054578e68f.png)

I “chopped” the equation in little bits fo clarity :

b = (2 * basalDose)/(Math.PI * duration);  // duration is 27 hours

x = (Date.now() - time0)/(60 * 60 * 1000); //time0 is the time of injection

g = x-(duration / 2);

gg = Math.pow(g,2);

h = duration / 2;

hh= Math.pow(h,2);

z = (x-gg) / hh;

bb = Math.pow(b,2);

y = 2 * Math.sqrt(bb * (1+z)); // where y is the activity of glargine over time


Here is a visual aid illustrating the differences between the activity curves of detemir and glargine at different doses:
 
![image](https://user-images.githubusercontent.com/18611419/109794249-5745fe00-7c1e-11eb-9d94-839c4a34d706.png)


Modeling the absorption of Carbs from the gut
=============================================

There are many complicated and more or less precise published models of carb absorption, but for the purpose of this simulation, a simple bilinear model like the one found in the book "Think Like a Pancreas" by Gary Scheiner, and used in Percetus' Glycodyn simulator will do for now. https://github.com/Perceptus/GlucoDyn/blob/master/basic_math.pdf 


Modeling the Endogenous Glucose Production (EGP) by the liver
=============================================================

While this is absolutely neither true nor realistic, for the time being the EGP is modeled as a linear function of time. It equivalents to 10g of absorbed carbs/hour, so depending on the user's insulin sensitivity factor (ISF, mmol/l/U) and carb ratio (CR, g/U), an the EGP effect is EGP * ISF * CR expressed in mmol/l/g. 

The EGP is significantly affected but the insulin activity, since in the repleted rested state, insulin decreases the liver glucose production more than it increases the peripheral glucose uptake. Moreover other factor like the ingestion of alcohol will significantly decrease the EGP, which could be simple modeled in the future.


Modeling exercise
=================
Exercise modeling is not part of the project yet.

Random effects
==============
No random effect are yet coded, but in a biological environment, a certain imprecision should be anticipated and taken into account. It can affect the absorption of mealtime and basal insulins (timing and amounts), as well as the absorption of carbs. 


Mechanics of the simulator
==========================
I run the software on a Ubuntu 20.04 virtual machine (a droplet on Digital Ocean, but any physical or virtual computer will do). So it is an realtime bot collecting insulin and food entries from Nightscout, and uploading sensor glucose values (SGV) data back to Nightscout. The CGMSIM user doesn't have to use any other software or hardware, only a working Nightscout website with the Careportal plugin installed.

Inputs for every category (virtual mealtime insulins, virtual meals) are declared using Careportal. Long acting or "basal" insulin agonists must be declared as "announcements", and in the text field the correct insulin product and dose are to be declared using the following format: "detemir 15" or "glargin 26" (without quotes).

The first bash script (get-all.sh) first calls the "entries.json" and "sgv.json" using the Nightscout API, every 5 minutes. From the entries, I identify the (mealtime) insulins and meals, as well as the "announcements", containing data about basal insulins (product and dose). 

Since I have about no idea how to code this correctly (grin), I arbitrarily decided to retain only 5 latest mealtime insulin doses. Since the DIA of mealtime insulins is set at 300 minutes or 5 hours, it is unlikely that a simulator user will enter more than 5 doses of mealtime insulin (boluses) during this time. The activity of each bolus is computed separately and a total activity of last 5 boluses is determined.

For basal insulins, I take into account 3 latest declared doses, so that in case of irregular detemir use, I am still able to compute the activity of the "oldest" dose (more than 24 hours agoa) if necessary. Also, the activity of each dose is computed separately and all activities are added.

At this stage, only the latest meal (amount of carbs and time of ingestion) are retrieved from the entries, and the carb absorption time is set to 180 min. This will be completed so that the apsorption time can be declared in Careportal and taken into account later.

When all data about blood glucose (BG) increasing factors (carbs and EGP), as well as BG decreasing factors (mealtime and basal insulins) are computed, their additive effect will be reflected in the sensor glucose value (sgv) uploaded to NS every 5 minutes. No predition curves are computed or displayed.

