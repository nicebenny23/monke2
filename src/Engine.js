const WorldEnvironment = require('./Environments/WorldEnvironment');
const ControlPanel = require('./Controllers/ControlPanel');
const OrganismEditor = require('./Environments/OrganismEditor');
const ColorScheme = require('./Rendering/ColorScheme');

// If the simulation speed is below this value, a new interval will be created to handle ui rendering
// at a reasonable speed. If it is above, the simulation interval will be used to update the ui.
const min_render_speed = 60;

class Engine {
    constructor(){
        this.fps = 60;
        this.env = new WorldEnvironment(5);
        this.organism_editor = new OrganismEditor();
        this.controlpanel = new ControlPanel(this);
        this.colorscheme = new ColorScheme(this.env, this.organism_editor);
        this.colorscheme.loadColorScheme();
        this.env.OriginOfLife();
        
        this.sim_last_update = Date.now();
        this.sim_delta_time = 0;

        this.ui_last_update = Date.now();
        this.ui_delta_time = 0;

        this.actual_fps = 0;
        this.running = false;
    }

    start(fps=60) {
        if (fps <= 0)
            fps = 1;
        this.fps = fps;
        this.frame_time = 1000/fps;
        console.log(this.frame_time)
        this.running = true;
        this.simUpdate();

        // this.sim_loop = setInterval(()=>{
        //     this.updateSimDeltaTime();
        //     this.environmentUpdate();
        // }, 1000/fps);

        if (this.fps >= min_render_speed) {
            if (this.ui_loop != null) {
                clearInterval(this.ui_loop);
                this.ui_loop = null;
            }
        }
        else
            this.setUiLoop();
    }

    simUpdate() {
        let start = Date.now()
        this.updateSimDeltaTime();
        this.environmentUpdate();
        let compute_time = Date.now() - start;
        if(this.running){
            let timeout = this.frame_time - compute_time;
            timeout = Math.max(timeout, 0); // can't be less than 0
            // if (timeout>0)
            this.sim_timeout = setTimeout(() => {
                this.simUpdate();
            }, timeout);
            // else 
            //     this.simUpdate();
        }

    }
    
    stop() {
        clearInterval(this.sim_loop);
        this.running = false;
        this.setUiLoop();
    }

    restart(fps) {
        // clearInterval(this.sim_loop);
        clearTimeout(this.sim_timeout)
        this.start(fps);
    }

    setUiLoop() {
        if (!this.ui_loop) {
            this.ui_loop = setInterval(()=> {
                this.updateUIDeltaTime();
                this.necessaryUpdate();
            }, 1000/min_render_speed);
        }
    }

    updateSimDeltaTime() {
        this.sim_delta_time = Date.now() - this.sim_last_update;
        this.sim_last_update = Date.now();
        if (!this.ui_loop) // if the ui loop isn't running, use the sim delta time
            this.ui_delta_time = this.sim_delta_time;
    }

    updateUIDeltaTime() {
        this.ui_delta_time = Date.now() - this.ui_last_update;
        this.ui_last_update = Date.now();
    }

    environmentUpdate() {
        this.actual_fps = (1000/this.sim_delta_time);
        this.env.update(this.sim_delta_time);
        if(this.ui_loop == null) {
            this.necessaryUpdate();
        }
    }

    necessaryUpdate() {
        this.env.render();
        this.controlpanel.update(this.ui_delta_time);
        this.organism_editor.update();
    }

}

module.exports = Engine;
