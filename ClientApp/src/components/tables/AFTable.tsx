import React from 'react';
import '../App.css';
import {
  Table,
  TableBody as Body,
  TableRow as Row,
  TableCell as Cell,
} from '@mui/material';
import { calculateAFRank } from '../../utils';
import { AFTableProps, AFChartRow, Country } from '../../types';

const AFTable: React.FC<AFTableProps> = ({charts}) => {
  return (
    <div className="af-table">
    <h2>AF</h2>
    <h3>This ranking displays the Average Finish, meaning the average of every individual position on each given category. You must have finished a run on every category to qualify for these rankings.</h3>
    <Table>
        <th>Rank</th>
        <th>Country</th>
        <th>Player</th>
        <th>Score</th>
        <Body>
        {charts.map((row: AFChartRow) => (
            <Row key={row.playerId}>
            <Cell>{calculateAFRank(row, charts)}</Cell>
            <Cell><img src={`/assets/flags/${Country[row.country]}.png`} alt={Country[row.country]} style={{ width: '3.5vh', height: '2vh' }} /></Cell>
            <Cell className="nobr"><a href={`/player/${row.playerId}`}>{row.name}</a></Cell>
            <Cell>{row.af.toFixed(4)}</Cell>
            </Row>
        ))}
        </Body>
    </Table>
    </div>
  );
};

export default AFTable;
