import React, { Component } from 'react';
import 'intersection-observer';
import scrollama from 'scrollama';
import './App.scss';

const scroller = scrollama();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      generationPieces: [],
      board: null
    };
    this.myRef = React.createRef();
  }

  componentDidMount = () => {
    // setup resize event

    let boardSize = 20;
    let board = new Map();

    let gameBridge = [
      [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0]
    ];

    if (this.myRef.current === null) return;
    let canvasContext = this.myRef.current.getContext('2d');
    canvasContext.fillStyle = 'gray';
    canvasContext.fillRect(20, 20, boardSize * 22 + 2, boardSize * 22 + 2);

    gameBridge.forEach((row, rowIndex) => {
      row.forEach((grid, gridIndex) => {
        let gridStatus;
        if (grid === 0) {
          gridStatus = 'pit';
        } else if (grid === 1) {
          gridStatus = 'floor';
        } else {
          gridStatus = 'goal';
        }
        board.set(`${gridIndex},${rowIndex}`, gridStatus);
      });
    });

    board.forEach((value, key) => {
      let gridColor;
      if (value === 'floor') {
        gridColor = 'white';
      } else if (value === 'pit') {
        gridColor = 'black';
      } else {
        gridColor = 'yellow';
      }
      canvasContext.fillStyle = gridColor;
      let keyArr = key.split(',');

      canvasContext.fillRect(
        22 * (parseInt(keyArr[0]) + 1),
        22 * (parseInt(keyArr[1]) + 1),
        20,
        20
      );
      canvasContext.fillStyle = 'red';
      canvasContext.fillRect(
        22 * (parseInt(2) + 1),
        22 * (parseInt(0) + 1),
        20,
        20
      );
    });

    let movesOptions = ['D', 'R'];

    const initializer = () => {
      let populationList = [];

      for (let i = 0; i < 40; i++) {
        populationList[i] = [];
      }

      populationList.forEach(indivOrganism => {
        for (let i = 0; i < 6; i++) {
          indivOrganism[i] =
            movesOptions[Math.floor(Math.random() * movesOptions.length)];
        }
      });
      return populationList;
    };

    const fitness = population => {
      let fittest1 = { selected: [], fitnessScore: 0 };
      let fittest2 = { selected: [], fitnessScore: 0 };
      let endGoal = [18, 19];
      let totalDistance = 17 - 2 + 19;

      population.forEach(individuals => {
        let fitnessScore;
        let startingPosition = [2, 0];
        let fellOnMoving = false;

        for (let i = 0; i < individuals.length; i++) {
          if (individuals[i] === 'D' && startingPosition[1] !== 19) {
            startingPosition[1] += 1;
          } else if (individuals[i] === 'R' && startingPosition[0] !== 19) {
            startingPosition[0] += 1;
          }
          let perMove = board.get(startingPosition.join(','));
          if (perMove === 'pit') {
            fellOnMoving = true;
          }
        }
        let landingPos = board.get(startingPosition.join(','));

        if (landingPos === 'pit' || fellOnMoving) {
          fitnessScore = 0;
        } else if (landingPos === 'floor' && !fellOnMoving) {
          let distanceX = endGoal[0] - startingPosition[0];
          let distanceY = endGoal[1] - startingPosition[1];
          fitnessScore = totalDistance - (distanceX + distanceY);
        } else if (landingPos === 'goal' && !fellOnMoving) {
          let distanceX = endGoal[0] - startingPosition[0];
          let distanceY = endGoal[1] - startingPosition[1];
          fitnessScore = totalDistance - (distanceX + distanceY);
        }

        if (fitnessScore > fittest1.fitnessScore) {
          let temp = fittest1.selected;
          fittest1.selected = individuals;
          fittest1.fitnessScore = fitnessScore;
          fittest2.selected = temp;
        } else if (
          fitnessScore > fittest2.fitnessScore &&
          fitnessScore <= fittest1.fitnessScore
        ) {
          fittest2.selected = individuals;
          fittest2.fitnessScore = fitnessScore;
        }
      });
      if (fittest1.fitnessScore === 0) {
        fittest1.selected =
          population[Math.floor(Math.random() * population.length)];
      }
      if (fittest2.fitnessScore === 0) {
        fittest2.selected =
          population[Math.floor(Math.random() * population.length)];
      }

      return [fittest1, fittest2];
    };

    const breeding = fittestPair => {
      let fittest1 = fittestPair[0].selected;
      let fittest2 = fittestPair[1].selected;
      let fittestOffspring = [];
      let willAddNewMove = false;
      let randomGeneSelector = Math.ceil(
        (Math.random() * fittestPair.length) / 2
      );
      for (
        let i = randomGeneSelector;
        i < randomGeneSelector + fittestPair.length / 2;
        i++
      ) {
        fittestOffspring[i] = fittest1[i];
      }
      for (let i = 0; i < fittest2.length; i++) {
        if (!fittestOffspring[i]) {
          fittestOffspring[i] = fittest2[i];
        }
      }
      if (
        fittestPair[0].fitnessScore !== 0 &&
        fittestPair[1].fitnessScore !== 0
      ) {
        willAddNewMove = true;
      }

      let populationList = [];
      for (let i = 0; i < 40; i++) {
        if (willAddNewMove) {
          populationList[i] = [
            ...fittestOffspring,
            movesOptions[Math.floor(Math.random() * movesOptions.length)]
          ];
        } else {
          let removeAStep = [...fittestOffspring];
          removeAStep.pop();

          populationList[i] = removeAStep;
        }
      }

      return populationList;
    };

    const mutation = (mutationPercentage, populationList) => {
      populationList.forEach(individuals => {
        for (let i = 0; i < individuals.length; i++) {
          let randomNumber = Math.random();
          if (randomNumber <= mutationPercentage / 100) {
            individuals[i] =
              movesOptions[Math.floor(Math.random() * movesOptions.length)];
          }
        }
      });
      return populationList;
    };

    const startEnvironment = population => {
      let ecosystem = population;
      let generations = -1;
      let fittestIndiv = [];
      let startingPosition = [2, 0];
      let endGoal = ['16,19', '17,19', '18,19'];
      let landingPos = [];
      let returningGenerations = [];
      let fitnessScore = -1;

      while (
        landingPos.join(',') !== endGoal[0] &&
        landingPos.join(',') !== endGoal[1] &&
        landingPos.join(',') !== endGoal[2] &&
        fitnessScore < 36
      ) {
        landingPos = [...startingPosition];

        generations++;
        fittestIndiv = fitness(ecosystem)[0];
        for (let i = 0; i < fittestIndiv.selected.length; i++) {
          if (fittestIndiv.selected[i] === 'D' && landingPos[1] !== 19) {
            landingPos[1] += 1;
          } else if (fittestIndiv.selected[i] === 'R' && landingPos[0] !== 19) {
            landingPos[0] += 1;
          }
        }

        fitnessScore = fittestIndiv.fitnessScore;
        returningGenerations.push({
          fittest: fittestIndiv.selected,
          score: fittestIndiv.fitnessScore
        });

        ecosystem = mutation(5, breeding(fitness(ecosystem)));
      }

      return returningGenerations;
    };

    //   const boardAnimation = individuals => {
    //     let startingPos = [2, 0];
    //     let counter = 0;
    //     let timer = window.setInterval(() => {
    //       if (counter < individuals.length) {
    //         if (individuals[counter] === 'D' && startingPos[1] !== 19) {
    //           startingPos[1] += 1;
    //         } else if (individuals[counter] === 'R' && startingPos[0] !== 19) {
    //           startingPos[0] += 1;
    //         }
    //         board.forEach((value, key) => {
    //           let gridColor;
    //           if (value === 'floor') {
    //             gridColor = 'white';
    //           } else if (value === 'pit') {
    //             gridColor = 'black';
    //           } else {
    //             gridColor = 'yellow';
    //           }
    //           canvasContext.fillStyle = gridColor;
    //           let keyArr = key.split(',');

    //           canvasContext.fillRect(
    //             22 * (parseInt(keyArr[0]) + 1),
    //             22 * (parseInt(keyArr[1]) + 1),
    //             20,
    //             20
    //           );
    //         });
    //         canvasContext.fillStyle = 'red';
    //         canvasContext.fillRect(
    //           22 * (parseInt(startingPos[0]) + 1),
    //           22 * (parseInt(startingPos[1]) + 1),
    //           20,
    //           20
    //         );
    //       }
    //       counter++;
    //     }, 500);

    //     return timer;
    //   };

    //   const animateGeneration = movementArray => {
    //     boardAnimation(movementArray[movementArray.length - 1].fittest);
    //   };

    let generationPieces = startEnvironment(initializer());
    // animateGeneration(generationPieces);
    this.setState({ generationPieces, board });
  };

  componentDidUpdate = () => {
    let timer;
    let canvasContext = this.myRef.current.getContext('2d');
    const boardAnimation = individuals => {
      let startingPos = [2, 0];
      let counter = 0;
      let timer = window.setInterval(() => {
        if (counter < individuals.length) {
          if (individuals[counter] === 'D' && startingPos[1] !== 19) {
            startingPos[1] += 1;
          } else if (individuals[counter] === 'R' && startingPos[0] !== 19) {
            startingPos[0] += 1;
          }
          canvasContext.fillStyle = 'red';
          canvasContext.fillRect(
            22 * (parseInt(2) + 1),
            22 * (parseInt(0) + 1),
            20,
            20
          );
          this.state.board.forEach((value, key) => {
            let gridColor;
            let keyArr = key.split(',');
            if (value === 'floor' && key) {
              gridColor = 'white';
            } else if (value === 'pit') {
              gridColor = 'black';
            } else {
              gridColor = 'yellow';
            }

            canvasContext.fillStyle = gridColor;

            canvasContext.fillRect(
              22 * (parseInt(keyArr[0]) + 1),
              22 * (parseInt(keyArr[1]) + 1),
              20,
              20
            );
          });
          canvasContext.fillStyle = 'red';
          canvasContext.fillRect(
            22 * (parseInt(startingPos[0]) + 1),
            22 * (parseInt(startingPos[1]) + 1),
            20,
            20
          );
        }
        counter++;
      }, 500);

      return timer;
    };
    scroller
      .setup({
        step: '.step'
      })
      .onStepEnter(response => {
        // { element, index, direction }

        timer = boardAnimation(
          this.state.generationPieces[response.index].fittest
        );
        console.log(response.index);
      })
      .onStepExit(() => {
        // { element, index, direction }
        window.clearInterval(timer);
      });
    window.addEventListener('resize', scroller.resize);
  };

  render() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    return (
      <div className="App">
        <canvas
          id="maze-genetics"
          ref={this.myRef}
          width={width.toString()}
          height={height.toString()}
        />
        <div className="scroll__text">
          {this.state.generationPieces.map((element, index) => {
            return (
              <div className="step" key={index}>
                <h1>Generation: {index}</h1>
                <h2>Fitness Score: {element.score}</h2>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
