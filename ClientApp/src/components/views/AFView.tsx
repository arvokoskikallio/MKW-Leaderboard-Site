import React, { useEffect, useState } from 'react';
import { AFChartRow } from '../../types/common';
import '../App.css';
import Navbar from '../common/Navbar';
import AFTable from '../tables/AFTable';
import { getAFCharts } from '../../client/charts';
import FlapButtonsOverall from '../buttons/FlapButtonsOverall';
import GlitchButtons from '../buttons/GlitchButtons';
import { FlapOverallButtonState } from '../../types/enums';
import { PlayerChartFilter } from '../../types/filters';

const AFView = () => {
  const [glitchState, setGlitchState] = useState<boolean>(false);
  const [flapOverallState, setFlapOverallState] = useState<FlapOverallButtonState>(FlapOverallButtonState.Overall);
  const [allButtonState, setAllButtonState] = useState<boolean>(false);
  const [charts, setCharts] = useState<AFChartRow[]>([]);

  const handleGlitchClick = (buttonType: boolean) => {
    setGlitchState(buttonType);
  };

  const handleFlapOverallClick = (buttonType: FlapOverallButtonState) => {
    setFlapOverallState(buttonType);
  };

  const handleAllButtonClick = (buttonType: boolean) => {
    setAllButtonState(buttonType);
  };

  useEffect(() => {
    const filter: PlayerChartFilter = {
        glitch: glitchState,
        threeLap: flapOverallState === FlapOverallButtonState.Overall || flapOverallState === FlapOverallButtonState.ThreeLapOnly,
        flap: flapOverallState === FlapOverallButtonState.Overall || flapOverallState === FlapOverallButtonState.FlapOnly,
        all: allButtonState,
    }
    const fetchData = async () => {
      const fetchedCharts = await getAFCharts(filter);
      setCharts(fetchedCharts);
    };

    fetchData();
  }, [allButtonState, flapOverallState, glitchState]);

  return (
    <div>
      <Navbar />
      <div>
        <div>
            <GlitchButtons onButtonClick={handleGlitchClick} />
        </div>
        <div>
            <FlapButtonsOverall onButtonClick={handleFlapOverallClick} />
        </div>
        <div className="button-container">
            <label className="all-box-label">
                Include scores outside the top 100
                <input type="checkbox" className="all-box" onChange={(event) => handleAllButtonClick(event.target.checked)} />
            </label>
        </div>
      </div>
      <div className="table-container">
        <AFTable charts={charts} />
      </div>
    </div>
  );
};

export default AFView;