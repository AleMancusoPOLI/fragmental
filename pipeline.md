1. simple knobs
    - probability DONE
    - pitch shifting DISCARDED
    - gain DONE
2. implement the slider
    - the algorithm DONE
    - the UI DONE (no range, just slider)
3. recording DONE
4. export DONE
5. envelopes DONE
6. effects WIP
   * stand-alone effects
   * multiple effects (ethereal, vintage, etc...)
8. audio library DONE
9. UI/UX

------------------------
TODO:
* add right info for Tooltips
* add more samples (5/6)
* add right descriptions for samples
* fix the recording export
    * recording doesn't record effects
        * solution: separate Recorder component from Player and pass final node to the Recorder
* documentation ?
* fix envelope:
    - add dots info
    - add curvatures
------------

Prioritized:
- create composite effects (leave also the stand alone ones? probably not)
- separate Recorder from Player and root it after the effects have been applied
- add descriptions to every knob
- add more samples
- add description to samples
- UI and design (background, colors, knobs, sliders…)
