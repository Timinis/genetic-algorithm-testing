interface Fittest {
  selected: string[] | never[];
  fitnessScore: number;
}

let geneticCoding = 'abcdefghijklmnopqrstuvwxyz';

const initializer = (): string[][] => {
  let populationList: string[][] = [];

  for (let i = 0; i < 40; i++) {
    populationList[i] = [];
  }

  populationList.forEach(indivOrganism => {
    for (let i = 0; i < 6; i++) {
      indivOrganism[i] = geneticCoding[Math.floor(Math.random() * 26)];
    }
  });
  return populationList;
};

const fitness = (environmentSetting: string[], population: string[][]) => {
  let fittest1: Fittest = { selected: [], fitnessScore: 0 };
  let fittest2: Fittest = { selected: [], fitnessScore: 0 };
  population.forEach(individuals => {
    let fitnessScore = 0;
    for (let i = 0; i < 6; i++) {
      if (individuals[i] === environmentSetting[i]) {
        fitnessScore++;
      }
    }
    if (fitnessScore > fittest1.fitnessScore) {
      fittest1.selected = individuals;
      fittest1.fitnessScore = fitnessScore;
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
      population[Math.ceil(Math.random() * population.length)];
  }
  if (fittest2.fitnessScore === 0) {
    fittest2.selected =
      population[Math.ceil(Math.random() * population.length)];
  }
  return [fittest1.selected, fittest2.selected];
};

const breeding = (fittestPair: string[][]) => {
  let fittest1 = fittestPair[0];
  let fittest2 = fittestPair[1];
  let fittestOffspring: string[] = [];
  let randomGeneSelector = Math.ceil((Math.random() * fittestPair.length) / 2);
  for (let i = randomGeneSelector; i < randomGeneSelector + 3; i++) {
    fittestOffspring[i] = fittest1[i];
  }
  for (let i = 0; i < fittest2.length; i++) {
    if (!fittestOffspring[i]) {
      fittestOffspring[i] = fittest2[i];
    }
  }
  let populationList = [];
  for (let i = 0; i < 40; i++) {
    populationList[i] = [...fittestOffspring];
  }

  return populationList;
};

const mutation = (mutationPercentage: number, populationList: string[][]) => {
  populationList.forEach(individuals => {
    for (let i = 0; i < individuals.length; i++) {
      let randomNumber = Math.random();
      if (randomNumber <= mutationPercentage / 100) {
        individuals[i] = geneticCoding[Math.floor(Math.random() * 26)];
      }
    }
  });
  return populationList;
};

const startEnvironment = (
  population: string[][],
  environmentSetting: string[]
) => {
  let ecosystem = population;
  let generations = -1;
  let fittestIndiv: string[] = [];
  let environmentSettingTester = environmentSetting.join('');
  while (fittestIndiv.join('') !== environmentSettingTester) {
    generations++;
    fittestIndiv = fitness(environmentSetting, ecosystem)[0];
    console.log(
      `Generation: ${generations}, Fittest Individual: ${fittestIndiv.join('')}`
    );
    ecosystem = mutation(5, breeding(fitness(environmentSetting, ecosystem)));
  }
};
startEnvironment(initializer(), ['a', 'p', 'p', 'l', 'e', 's']);
