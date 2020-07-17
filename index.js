//collecting training data

let model;
let targetLabel = "C";
let trainingData = [];

let state = "collection";

let notes = {
  C: 261.6256,
  D: 293.6648,
  E: 329.6276,
};

let env, wave;

function setup() {
  createCanvas(800, 800);

  env = new p5.Envelope();
  env.setADSR(0.05, 0.1, 0.5, 1);
  env.setRange(1.2, 0);
  wave = new p5.Oscillator();
  wave.setType("sine");
  wave.start();
  wave.freq(440);
  wave.amp(env);

  let options = {
    inputs: ["x", "y"],
    ouputs: ["label"],
    task: "classification",
    debug: "true",
  };

  model = ml5.neuralNetwork(options);
  background(200);
}

function keyPressed() {
  //training the data
  if (key == "t") {
    state = "training";
    console.log("start");
    model.normalizeData();
    let options = {
      epochs: 200,
    };
    model.train(options, whileTraining, finishedTraining);
  }
  targetLabel = key.toUpperCase();
}

function whileTraining(epoch, less) {
  console.log(epoch);
}
function finishedTraining() {
  console.log("finished training");
  state = "prediction";
}

function mousePressed() {
  let inputs = {
    x: mouseX,
    y: mouseY,
  };
  if (state == "collection") {
    let target = {
      targetLabel,
    };

    trainingData.push(target);

    model.addData(inputs, target);

    stroke(0);
    noFill();
    ellipse(mouseX, mouseY, 24);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(targetLabel, mouseX, mouseY);

    wave.freq(notes[targetLabel]);
    env.play();
  } else if (state == "prediction") {
    model.classify(inputs, gotResults);
  }
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  console.log(results);
  stroke(0);
  fill(0, 255, 0, 100);
  ellipse(mouseX, mouseY, 24);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  let label = results[0].label;
  text(label, mouseX, mouseY);
  wave.freq(notes[label]);
  env.play();
}
