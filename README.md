# jquery-image-sequence
http://semiodesign.github.io/jquery-image-sequence/

## NB
Importing a huge sequenced jpg or png probably won't work. The image generated on our side is more than 600.000 pixels long. Even Photoshop won't import it (max Photoshop size: 300.000px).

Images broken down to slices (these slices will be merged some more - to have six overall and not twelve) and we'll define breakpoints/divs for each slice, positioned absolutely with different z-indexes.

That's the idea for now.
