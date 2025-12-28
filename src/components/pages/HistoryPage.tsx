import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ArrowBack,
  PlayArrow,
  Person,
  EmojiEvents,
  Equalizer
} from '@mui/icons-material';
import { useGame } from '../../hooks/useGame';
import { Match, PlayerStatistics } from '../../types';
import { MatchReplay } from '../game/MatchReplay';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 4 }}>{children}</Box>}
    </div>
  );
}

export function HistoryPage() {
  const navigate = useNavigate();
  const { matches, statistics, loadMatches, loadStatistics } = useGame();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [replayOpen, setReplayOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadMatches();
    loadStatistics();
  }, [loadMatches, loadStatistics]);

  const handleViewMatch = (match: Match) => {
    setSelectedMatch(match);
    setReplayOpen(true);
  };

  const handleCloseReplay = () => {
    setReplayOpen(false);
    setSelectedMatch(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getMatchResult = (match: Match) => {
    if (match.isDraw) return { text: 'Ничья', color: 'warning' as const };
    if (match.winner) {
      return {
        text: `${match.winner.name} победил`,
        color: 'success' as const
      };
    }
    return { text: 'В процессе', color: 'info' as const };
  };

  const sortedMatches = [...matches].sort((a, b) =>
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
        >
          Новая игра
        </Button>

        <Typography variant="h4" component="h1">
          История игр
        </Typography>

      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="history tabs">
          <Tab label="История матчей" />
          <Tab label="Статистика" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {sortedMatches.length === 0 ? (
          <Box>
            <Paper sx={{ p: 6, textAlign: 'center' }} elevation={0}>
              <Typography variant="h6" color="text.secondary">
                Матчи пока не сыграны
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => navigate('/')}
              >
                Начать первую игру
              </Button>
            </Paper>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Дата</TableCell>
                  <TableCell>Игроки</TableCell>
                  <TableCell>Результат</TableCell>
                  <TableCell>Ходы</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedMatches.map((match) => {
                  const result = getMatchResult(match);
                  return (
                    <TableRow key={match.id} hover>
                      <TableCell>
                        {formatDate(match.startTime)}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2">
                            {match.players[0].name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            против
                          </Typography>
                          <Typography variant="body2">
                            {match.players[1].name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={result.text}
                          color={result.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {match.gameState.moves.length}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleViewMatch(match)}
                          disabled={!match.endTime}
                        >
                          <PlayArrow />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {statistics.length === 0 ? (
          <Box>
            <Paper sx={{ p: 6, textAlign: 'center' }} elevation={0}>
              <Typography variant="h6" color="text.secondary">
                Статистика пока недоступна
              </Typography>
            </Paper>
          </Box>
        ) : (
          <Box>
            {statistics.map((stat) => (
              <Box key={stat.playerId} mb={2}>
                <Card elevation={0}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Person sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6">
                        {stat.playerName}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mb={1}>
                      <EmojiEvents sx={{ mr: 1, color: 'success.main' }} />
                      <Typography variant="body2">
                        Побед: {stat.wins}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mb={1}>
                      <Equalizer sx={{ mr: 1, color: 'error.main' }} />
                      <Typography variant="body2">
                        Поражений: {stat.losses}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Ничьих: {stat.draws}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" mb={2}>
                      Игр сыграно: {stat.gamesPlayed}
                    </Typography>

                    <Chip
                      label={`Процент побед: ${stat.winRate.toFixed(1)}%`}
                      color={stat.winRate >= 60 ? 'success' : stat.winRate >= 40 ? 'warning' : 'error'}
                      size="small"
                    />
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </TabPanel>

      <Dialog
        open={replayOpen}
        onClose={handleCloseReplay}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Повтор матча
        </DialogTitle>
        <DialogContent>
          {selectedMatch && (
            <MatchReplay match={selectedMatch} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReplay}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
