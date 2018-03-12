# Program synthesis using neural nets in [Domain-specific language](https://en.wikipedia.org/wiki/Domain-specific_language)

[Generated sciipts samples](https://thousandmonkeystypewriter.github.io/index.html#scripts)

## What is neural program synthesis?

In recent years, [Deep Learnig](https://en.wikipedia.org/wiki/Deep_learning) has made [considerable progress](https://arxiv.org/ftp/arxiv/papers/1801/1801.00631.pdf) in areas such as online advertising,, speech recognition and image recognition.  The success of DL lets us to change the view on the way the software itself is being created. We can use neural nets to gradualy increase automation in the process oft program creation, and help engineers to get more results with less efforts.

There are a great deal of applications for program synthesis. Successful systems could one day
automate a job that is currently very secure for humans: computer programming. Imagine a world
in which debugging, refactoring, translating and synthesizing code from sketches can all be done
without human effort. 

## What is Thousand Monkeys Typewriter?

TMT is the system for [program induction](https://arxiv.org/abs/1703.07469) that generates simple scripts in a Domain-specifil language. The system combines [supervised](https://en.wikipedia.org/wiki/Supervised_learning) and [unsupervised](https://en.wikipedia.org/wiki/Unsupervised_learning) learning. The core is the [Neural Programmer-Interpreter](https://arxiv.org/abs/1511.06279), is capable of abstraction and higher-order controls over the program. The system works for error detection in both user logs and software source sode.

TMT also incorporates most common conceprions used today in a field of program synthesis are [satisfiability modulo theories (SMT) and counter-example-guided inductive synthesis (CEGIS)](http://rsta.royalsocietypublishing.org/content/375/2104/20150403).

### Types of data

There are two types of data (logs) that we are analyzing:

- user logs
- program traces

### Supervised and unsupervised

To analyze logs, we are using both unsupervised technique ([Donut](https://arxiv.org/pdf/1802.03903.pdf) for user logs), and supervised (engineers mark anomalies in software traces using j-unit tests).

### NPI

NPI is the core of the system. It takes logs and traces and learns probabilities at each timestep and environment.

Neural Programmer (NPI) consists of:
1. [RNN](https://en.wikipedia.org/wiki/Recurrent_neural_network) controller that takes sequential state encodings built from (a) the world environment
(changes with actions), (b) the program call (actions) and (c) the arguments for the called
program. The entirety of the input is fed in the first timestep, so every action by the NPI
creates an output that is delivered as input.
2. [DSL functions](https://github.com/ThousandMonkeysTypewriter/DomainSpecificLanguage)
3. Domain itself where functions are executed ("scratchpad")

![NPI illustration](https://thousandmonkeystypewriter.github.io/npi.gif)

At the time, TMT generates simple scripts for anomaly detection in production logs.

## <a name="scripts"></a>How generator works

### DATA

At the moment, we analyze three types of logs: user logs, database logs, software traces.

### Detect anomalies

Then, we are trying to detect any problems that logs contain. What exactly are anomalies? Simply put, an anomaly is any deviation from standard behavior. 

Normal data representation:
![data](https://thousandmonkeystypewriter.github.io/Picture1.png)

Point anomalies, which are anomalies in a single value in the data:
![data](https://thousandmonkeystypewriter.github.io/Picture2.png)

Query execution time anomalies:
![detectum](https://thousandmonkeystypewriter.github.io/log.png)

We are aimed to detect anomalies in situtations such as: memory leaks, bottlenecks in Java runtime, server infrastructure problems etc.

As a result, we acquire training data, either labeled manually (supervised), or labeled by automatic classificator (unsupervised).

### Train Neural Programmer

After we get a list with labeled normal and abnormal events, we train our core to differ what's normal and what's not in trhe future.

In case of unsupervised learning, the process can be described as "one neural net teaching another":

event in log was labeled as normal:
![detectum](https://thousandmonkeystypewriter.github.io/scheme/normal_log.png)

event in log was labeled as abnormal:
![detectum](https://thousandmonkeystypewriter.github.io/scheme/anomaly_log.png)

db query was labeled as normal:
![detectum](https://thousandmonkeystypewriter.github.io/scheme/normal_db.png)

db query was labeled as abnormal:
![detectum](https://thousandmonkeystypewriter.github.io/scheme/anomaly_db.png)

In some cases, where situations by default are labeled as normal, we have only to decide what command to call next.
![detectum](https://thousandmonkeystypewriter.github.io/scheme/npi_only.png)

### Working with the scrpits in runtime

Having trained NPI means that, at each step, we have a predicted operation from argumeents and environment. Thus we expect from a well  trained model to predict each command and each step, indicating whether this observed sutuation in logs (software traces) is normal or not. If normal, we expect one outcome, of not - another. 

In other words< well trained model would predict an outcome from given state: label (by default, "normal"). Each combination of this parameters could produce different outcomes.

normal runtime script:
`BEGIN

DIFF

DIFF

CHECK

ALARM`


`{'program': {'program': 'begin', 'id': 0}, 'environment': {'date1': 0, 'output': 0, 'answer': 2, 'terminate': False, 'client_id': 2, 'date2': 0, 'date2_diff': 0, 'date1_diff': 0}, 'args': {'id': 29}}`

`{'program': {'program': 'diff', 'id': 6}, 'environment': {'date1': 15, 'output': 0, 'answer': 2, 'terminate': False, 'client_id': 2, 'date2': 0, 'date2_diff': 0, 'date1_diff': 93}, 'args': {'id': 29}}`

`{'program': {'program': 'diff', 'id': 6}, 'environment': {'date1': 15, 'output': 0, 'answer': 2, 'terminate': False, 'client_id': 2, 'date2': 20, 'date2_diff': 45, 'date1_diff': 93}, 'args': {'id': 29}}`

`{'program': {'program': 'check', 'id': 3}, 'environment': {'date1': 15, 'output': 1, 'answer': 2, 'terminate': False, 'client_id': 2, 'date2': 20, 'date2_diff': 45, 'date1_diff': 93}, 'args': {'id': 29}}`

`{'program': {'program': 'alarm', 'id': 4}, 'environment': {'date1': 15, 'output': 1, 'answer': 2, 'terminate': True, 'client_id': 2, 'date2': 20, 'date2_diff': 45, 'date1_diff': 93}, 'args': {'id': 29}}`

alert runtime script:
![detectum](https://thousandmonkeystypewriter.github.io/scheme/npi_only.png)

### Challenge

One of the problems with NPIs is that we can only measure the generalization by running the trained NPI on various environments and observing the results. And as we explained earlier, every change of the peremeters can produce a new script.

For the sake of simplicity, we want co create on scipt that will cover many (all) situations:
![detectum](https://thousandmonkeystypewriter.github.io/scheme/npi_only.png)


Examples:

- ![detectum](https://thousandmonkeystypewriter.github.io/detectum.png)[web/detectum/logs](https://github.com/ThousandMonkeysTypewriter/GeneratedScripts/tree/master/app/facebook/swift/logs)
- ![yandex](https://thousandmonkeystypewriter.github.io/yandex.png)[db/yandex/clickhouse/logs](https://github.com/ThousandMonkeysTypewriter/GeneratedScripts/tree/master/app/facebook/swift/logs)
- ![facebook](https://thousandmonkeystypewriter.github.io/facebook.png)[app/facebook/swift/logs](https://github.com/ThousandMonkeysTypewriter/GeneratedScripts/tree/master/app/facebook/swift/logs)

## References

[Deep Learning: A Critical Appraisal](https://arxiv.org/ftp/arxiv/papers/1801/1801.00631.pdf)

[Andrej Karpathy: Software 2.0](https://medium.com/@karpathy/software-2-0-a64152b37c35)

[Neuro-Symbolic Program Synthesis](https://www.microsoft.com/en-us/research/publication/neuro-symbolic-program-synthesis-2/)

[Improving the Universality and Learnability of Neural Programmer-Interpreters with Combinator Abstraction](https://arxiv.org/abs/1802.02696)

[Unsupervised Anomaly Detection via Variational Auto-Encoder for Seasonal KPIs in Web Applications
](https://arxiv.org/abs/1802.03903)

[A curated list of awesome machine learning frameworks and algorithms that work on top of source code](https://github.com/src-d/awesome-machine-learning-on-source-code/)

## <a name="npc"></a>Neural programmer concepts

[RobustFill (Microsoft)](https://arxiv.org/abs/1703.07469)

[DeepCoder (Microsoft)](https://openreview.net/pdf?id=ByldLrqlx)

[Program Synthesis with Reinforcement Learning (Google)](https://arxiv.org/abs/1801.03526)

[Bayou (https://github.com/capergroup/bayou)](https://arxiv.org/abs/1703.05698)

[Tree-to-tree parser](https://openreview.net/forum?id=Skp1ESxRZ)

[Kayak (DiffBlue)](https://arxiv.org/abs/1712.07388)


![Our monkey](https://thousandmonkeystypewriter.github.io/220px-Chimpanzee_seated_at_typewriter.jpg)
