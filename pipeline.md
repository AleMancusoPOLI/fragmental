1. simple knobs
    - probability DONE
    - pitch shifting DONE
    - gain DONE
2. implement the slider
    - the algorithm DONE
    - the UI DONE (no range, just slider)
3. recording DONE
4. export DONE
5. envelopes
6. effects WIP
   6.1. stand-alone effects
   6.2. multiple effects (ethereal, vintage, etc...)
8. audio library 
9. UI/UX

----
FIXES:
* fix the performance
* add info panels on hover --> create info component and show it on hover
* fix the recording export
    * can't use it in DAW (probably duration/metadata issues)
    * recording rate is faster thatn actual play rate
    * recording doesn't record effects
        * solution: separate Recorder component from Player and pass final node to the Recorder
