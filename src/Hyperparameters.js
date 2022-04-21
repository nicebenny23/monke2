const Neighbors = require("./Grid/Neighbors");

const Hyperparams = {
    setDefaults: function() {
        this.headless = false;
        this.Multiplier = 1;
        this.lifespanMultiplier = 100;
        this.foodProdProb = 4;
        this.foodProdProbScalar = 4;
        this.killableNeighbors = Neighbors.adjacent;
        this.edibleNeighbors = Neighbors.adjacent;
        this.growableNeighbors = Neighbors.adjacent;
        
        this.useGlobalMutability = false;
        this.globalMutability = 5;
        this.addProb = 33;
        this.changeProb = 33;
        this.removeProb = 33;
        
        this.moversCanRotate = true;
        this.offspringRotate = true;

        this.foodBlocksReproduction = true;
        this.moversCanProduce = false;

        this.instaKill = false;
    
        this.lookRange = 20;

        this.foodDropProb = 0;
    },
}

Hyperparams.setDefaults();

module.exports = Hyperparams;