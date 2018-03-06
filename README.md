## Program synthesis using neural nets in [Domain-specific language](https://en.wikipedia.org/wiki/Domain-specific_language)

### What is neural program synthesis?

In recent years, [Deep Learnig](https://en.wikipedia.org/wiki/Deep_learning) has made [considerable progress](https://arxiv.org/ftp/arxiv/papers/1801/1801.00631.pdf) in areas such as online advertising,, speech recognition and image recognition.  The success of DL lets us to change the view on the way the software itself is being created. We can use neural nets to gradualy increase automation in the process oft program creation, and help engineers to get more results with less efforts.

There are a great deal of applications for program synthesis. Successful systems could one day
automate a job that is currently very secure for humans: computer programming. Imagine a world
in which debugging, refactoring, translating and synthesizing code from sketches can all be done
without human effort. 

### What is Thousand Monkeys Typewriter?

TMT is the system for [program induction](https://arxiv.org/abs/1703.07469) that generates simple scripts in a Domain-specifil language. The system combines [supervised](https://en.wikipedia.org/wiki/Supervised_learning) and [unsupervised](https://en.wikipedia.org/wiki/Unsupervised_learning) learning. The core is the [Neural Programmer-Interpreter](https://arxiv.org/abs/1511.06279), is capable of abstraction and higher-order controls over the program. The system works for error detection in both user logs and software source sode.

TMT also incorporates most common conceprions used today in a field of program synthesis are [satisfiability modulo theories (SMT) and counter-example-guided inductive synthesis (CEGIS)](http://rsta.royalsocietypublishing.org/content/375/2104/20150403).

![SMT](https://thousandmonkeystypewriter.github.io/cegis.jpg)

## Types of data

Teher are to types of data (logs) that we are analyzing:

- users logs
- program traces

Logs are analyzed by unsupervised model [Donut](https://arxiv.org/pdf/1802.03903.pdf), which provides arguments (namely, which fact is @normal@ and which is not) to the Neural Programmer.

Neural Programmer (NPI) core consists of:
1. [RNN](https://en.wikipedia.org/wiki/Recurrent_neural_network) controller that takes sequential state encodings built from (a) the world environment
(changes with actions), (b) the program call (actions) and (c) the arguments for the called
program. The entirety of the input is fed in the first timestep, so every action by the NPI
creates an output that is delivered as input.
2. [DSL functions](https://github.com/ThousandMonkeysTypewriter/DomainSpecificLanguage)
3. Domain itself where functions are executed ("scratchpad")

![NPI illustration](https://thousandmonkeystypewriter.github.io/npi.gif)

At the time, TMT generates simple scripts for anomaly detection in production logs.

### References

[Deep Learning: A Critical Appraisal](https://arxiv.org/ftp/arxiv/papers/1801/1801.00631.pdf)

[Andrej Karpathy: Software 2.0](https://medium.com/@karpathy/software-2-0-a64152b37c35)

[Neuro-Symbolic Program Synthesis](https://www.microsoft.com/en-us/research/publication/neuro-symbolic-program-synthesis-2/)

[Improving the Universality and Learnability of Neural Programmer-Interpreters with Combinator Abstraction](https://arxiv.org/abs/1802.02696)

[Unsupervised Anomaly Detection via Variational Auto-Encoder for Seasonal KPIs in Web Applications
](https://arxiv.org/abs/1802.03903)

### <a name="npc"></a>Neural programmer concepts

[RobustFill (Microsoft)](https://arxiv.org/abs/1703.07469)

[DeepCoder (Microsoft)](https://openreview.net/pdf?id=ByldLrqlx)

[Program Synthesis with Reinforcement Learning (Google)](https://arxiv.org/abs/1801.03526)

[Bayou (https://github.com/capergroup/bayou)](https://arxiv.org/abs/1703.05698)

[Tree-to-tree parser](https://openreview.net/forum?id=Skp1ESxRZ)

[Kayak (DiffBlue)](https://arxiv.org/abs/1712.07388)


![Our monkey](https://thousandmonkeystypewriter.github.io/220px-Chimpanzee_seated_at_typewriter.jpg)
