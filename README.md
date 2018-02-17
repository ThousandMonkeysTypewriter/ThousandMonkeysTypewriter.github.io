## Program synthesis using neural nets in [Domain-specific language](https://en.wikipedia.org/wiki/Domain-specific_language)

### What is neural program synthesis?

In recent years, [Deep Learnig](https://en.wikipedia.org/wiki/Deep_learning) has made [considerable progress](https://arxiv.org/ftp/arxiv/papers/1801/1801.00631.pdf) in areas such as speech recognition, image recognition, and game playing.  The success of DL lets us to change the view on the way the software itself is being created. We can use neural nets to gradualy increase automation in the process oft programm creation, and help engineers to get more results with less efforts.

There are a great deal of applications for program synthesis. Successful systems could one day
automate a job that is currently very secure for humans: computer programming. Imagine a world
in which debugging, refactoring, translating and synthesizing code from sketches can all be done
without human effort. 

### What is Thousnad Monkeys Typewriter?

TMT is the system for [program induction]() that generates simple scripts in a [Domain-specifil language]. The system combines [supervised] and [unsupervised] learning. The core is the Neural Programmer-Interpreter, is capable of abstraction and higher-order controls over the program.

TMT also incorporates most common conceprions used today in a field of program synthesis are [satisfiability modulo theories (SMT) and [counter-example-guided inductive synthesis (CEGIS)](http://rsta.royalsocietypublishing.org/content/375/2104/20150403).

NPI core consists of:
1. RNN controller that takes sequential state encodings built from (a) the world environment
(changes with actions), (b) the program call (actions) and (c) the arguments for the called
program. The entirety of the input is fed in the first timestep, so every action by the NPI
creates an output that is delivered as input.
2. [DSL functions](https://github.com/ThousandMonkeysTypewriter/DomainSpecificLanguage)
3. Domain itself where functions are executed ("scratchpad")

![NPI illustration](https://thousandmonkeystypewriter.github.io/npi.gif)

NPI [learns by examples](https://arxiv.org/pdf/1802.02353.pdf) (supervised) or by providing instructions that fit all the constraints (SMT solver)


### Why do you need Thousnad Monkeys Typewriter?

Being software engineer, sometimes you have to create simple scripts (service, testing, integrational, parsing etc.) that just slightly deviates one from another. Instead writing countles conditions for each case, it's usefull to let AI to learn all cases for you, and to create each script for each case;


### Where do we go with all this AI?

Hopefully, with the progress of AI, in near future it will take less dull manual work to create software for every day use.

### References

[Deep Learning: A Critical Appraisal](https://arxiv.org/ftp/arxiv/papers/1801/1801.00631.pdf)

[Andrej Karpathy: Software 2.0](https://medium.com/@karpathy/software-2-0-a64152b37c35)

[RobustFill: Neural Program Learning](https://arxiv.org/abs/1703.07469)

[Neuro-Symbolic Program Synthesis](https://www.microsoft.com/en-us/research/publication/neuro-symbolic-program-synthesis-2/)

[Improving the Universality and Learnability of Neural Programmer-Interpreters with Combinator Abstraction](https://arxiv.org/abs/1802.02696)

