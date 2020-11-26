import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import { getSimbriefData } from './simbriefApi';
import './aewx-metar-parser.d';
import Time from "./time/Time";
import Toolbar from "./toolbar/Toolbar";
import DashboardWidget from "./dashboardWidget/DashboardWidget";
import LoadsheetWidget from "./loadsheetWidget/LoadsheetWidget";
import Settings from "./settings/Settings";
import Profile from "./profile/Profile";

import './App.scss';
import './time/Time.scss';
import './toolbar/Toolbar.scss';
import './dashboardWidget/DashboardWidget.scss';
import './loadsheetWidget/LoadsheetWidget.scss';
import './settings/Settings.scss';
import './profile/Profile.scss';

type AppProps = {};

type AppState = {
    simbriefUsername: string;
    departingAirport: string;
    departingIata: string;
    arrivingAirport: string;
    arrivingIata: string;
    flightDistance: string;
    flightETAInSeconds: string;
    currentTime: Date,
    initTime: Date,
    timeSinceStart: string,
    cargo: number,
    estLandingWeight: number,
    estTakeOffWeight: number,
    estZeroFuelWeight: number,
    maxLandingWeight: number,
    maxTakeOffWeight: number,
    maxZeroFuelWeight: number,
    passengerCount: number,
    passengerWeight: number,
    payload: number,
    avgFuelFlow: number,
    contingency: number,
    enrouteBurn: number,
    etops: number,
    extra: number,
    maxTanks: number,
    minTakeOff: number,
    planLanding: number,
    planRamp: number,
    planTakeOff: number,
    reserve: number,
    taxi: number,
    units: string,
    altIcao: string,
    altIata: string,
    altBurn: number,
    tripTime: number,
    contFuelTime: number,
    resFuelTime: number,
    taxiOutTime: number,
};

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.updateCurrentTime = this.updateCurrentTime.bind(this);
        this.updateTimeSinceStart = this.updateTimeSinceStart.bind(this);
        this.fetchSimbriefData = this.fetchSimbriefData.bind(this);
    }

    state: AppState = {
        departingAirport: 'N/A',
        departingIata: 'N/A',
        arrivingAirport: 'N/A',
        arrivingIata: 'N/A',
        simbriefUsername: this.fetchSimbriefUsername(),
        flightDistance: 'N/A',
        flightETAInSeconds: 'N/A',
        currentTime: new Date(),
        initTime: new Date(),
        timeSinceStart: "00:00",
        cargo: 0,
        estLandingWeight: 0,
        estTakeOffWeight: 0,
        estZeroFuelWeight: 0,
        maxLandingWeight: 0,
        maxTakeOffWeight: 0,
        maxZeroFuelWeight: 0,
        passengerCount: 0,
        passengerWeight: 0,
        payload: 0,
        avgFuelFlow: 0,
        contingency: 0,
        enrouteBurn: 0,
        etops: 0,
        extra: 0,
        maxTanks: 0,
        minTakeOff: 0,
        planLanding: 0,
        planRamp: 0,
        planTakeOff: 0,
        reserve: 0,
        taxi: 0,
        units: "kgs",
        altIcao: "N/A",
        altIata: "N/A",
        altBurn: 0,
        tripTime: 0,
        contFuelTime: 0,
        resFuelTime: 0,
        taxiOutTime: 0
    }

    updateCurrentTime(currentTime: Date) {
        this.setState({currentTime: currentTime});
    }

    updateTimeSinceStart(timeSinceStart: string) {
        this.setState({timeSinceStart: timeSinceStart});
    }

    fetchSimbriefUsername() {
        const username = window.localStorage.getItem("SimbriefUsername");
        if (username === null) {
            return '';
        } else {
            return username;
        }
    }

    async fetchSimbriefData() {
        if (!this.state.simbriefUsername) {
            return;
        }

        console.log("Fetching simbriefData");
        const simbriefData = await getSimbriefData(this.state.simbriefUsername);
        console.info(simbriefData);
        this.setState({
            departingAirport: simbriefData.origin.icao,
            departingIata: simbriefData.origin.iata,
            arrivingAirport: simbriefData.destination.icao,
            arrivingIata: simbriefData.destination.iata,
            flightDistance: simbriefData.distance,
            flightETAInSeconds: simbriefData.flightETAInSeconds,
            cargo: simbriefData.weights.cargo,
            estLandingWeight: simbriefData.weights.estLandingWeight,
            estTakeOffWeight:   simbriefData.weights.estTakeOffWeight,
            estZeroFuelWeight:  simbriefData.weights.estZeroFuelWeight,
            maxLandingWeight:   simbriefData.weights.maxLandingWeight,
            maxTakeOffWeight:   simbriefData.weights.maxTakeOffWeight,
            maxZeroFuelWeight:  simbriefData.weights.maxZeroFuelWeight,
            passengerCount:     simbriefData.weights.passengerCount,
            passengerWeight:    simbriefData.weights.passengerWeight,
            payload:            simbriefData.weights.payload,
            avgFuelFlow:        simbriefData.fuel.avgFuelFlow,
            contingency:        simbriefData.fuel.contingency,
            enrouteBurn:        simbriefData.fuel.enrouteBurn,
            etops:              simbriefData.fuel.etops,
            extra:              simbriefData.fuel.extra,
            maxTanks:           simbriefData.fuel.maxTanks,
            minTakeOff:         simbriefData.fuel.minTakeOff,
            planLanding:        simbriefData.fuel.planLanding,
            planRamp:           simbriefData.fuel.planRamp,
            planTakeOff:        simbriefData.fuel.planTakeOff,
            reserve:            simbriefData.fuel.reserve,
            taxi:               simbriefData.fuel.taxi,
            units:              simbriefData.units,
            altIcao:            simbriefData.alternate.icao,
            altIata:            simbriefData.alternate.iata,
            altBurn:            simbriefData.alternate.burn,
            tripTime:           simbriefData.times.est_time_enroute,
            contFuelTime:       simbriefData.times.contfuel_time,
            resFuelTime:        simbriefData.times.reserve_time,
            taxiOutTime:        simbriefData.times.taxi_out
        });
    }

    changeSimbriefUsername = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        this.setState({ simbriefUsername: event.target.value.toString() });
        window.localStorage.setItem("SimbriefUsername", event.target.value.toString());
    }

    render() {
        return (
            <Router>
                <Time initTime={this.state.initTime} updateCurrentTime={this.updateCurrentTime} updateTimeSinceStart={this.updateTimeSinceStart}/>
                <Toolbar fetchSimbrief={this.fetchSimbriefData}/>
                <div id="main-container">
                    <Switch>
                        <Route path="/dashboard">
                            <DashboardWidget
                                departingAirport={this.state.departingAirport}
                                arrivingAirport={this.state.arrivingAirport}
                                flightDistance={this.state.flightDistance}
                                flightETAInSeconds={this.state.flightETAInSeconds}
                                timeSinceStart={this.state.timeSinceStart} />
                        </Route>
                        <Route path="/loadsheet">
                            <LoadsheetWidget
                                cargo={this.state.cargo}
                                estLandingWeight={this.state.estLandingWeight}
                                estTakeOffWeight={this.state.estTakeOffWeight}
                                estZeroFuelWeight={this.state.estZeroFuelWeight}
                                maxLandingWeight={this.state.maxLandingWeight}
                                maxTakeOffWeight={this.state.maxTakeOffWeight}
                                maxZeroFuelWeight={this.state.maxZeroFuelWeight}
                                passengerCount={this.state.passengerCount}
                                passengerWeight={this.state.passengerWeight}
                                payload={this.state.payload}
                                avgFuelFlow={this.state.avgFuelFlow}
                                contingency={this.state.contingency}
                                enrouteBurn={this.state.enrouteBurn}
                                etops={this.state.etops}
                                extra={this.state.extra}
                                maxTanks={this.state.maxTanks}
                                minTakeOff={this.state.minTakeOff}
                                planLanding={this.state.planLanding}
                                planRamp={this.state.planRamp}
                                planTakeOff={this.state.planTakeOff}
                                reserve={this.state.reserve}
                                taxi={this.state.taxi}
                                units={this.state.units}
                                arrivingAirport={this.state.arrivingAirport}
                                arrivingIata={this.state.arrivingIata}
                                departingAirport={this.state.departingAirport}
                                departingIata={this.state.departingIata}
                                altBurn={this.state.altBurn}
                                altIcao={this.state.altIcao}
                                altIata={this.state.altIata}
                                tripTime={this.state.tripTime}
                                contFuelTime={this.state.contFuelTime}
                                resFuelTime={this.state.resFuelTime}
                                taxiOutTime={this.state.taxiOutTime}
                            />
                        </Route>
                        <Route path="/flight">
                            <div>
                            </div>
                        </Route>
                        <Route path="/multiplayer">
                            <div>
                            </div>
                        </Route>
                        <Route path="/settings">
                            <div>
                                <Settings />
                            </div>
                        </Route>
                        <Route path="/profile">
                            <Profile
                                simbriefUsername={this.state.simbriefUsername}
                                changeSimbriefUsername={this.changeSimbriefUsername} />
                        </Route>
                        <Route path="/">
                            <DashboardWidget
                                departingAirport={this.state.departingAirport}
                                arrivingAirport={this.state.arrivingAirport}
                                flightDistance={this.state.flightDistance}
                                flightETAInSeconds={this.state.flightETAInSeconds}
                                timeSinceStart={this.state.timeSinceStart}
                            />
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;