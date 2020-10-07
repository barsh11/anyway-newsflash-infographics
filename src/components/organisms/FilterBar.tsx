import React, { FC, useCallback, useState, useEffect } from 'react';
import { makeStyles, createStyles, Divider, Grid, Box } from '@material-ui/core';
import { AppBar, Toolbar } from '@material-ui/core';
import SelectButton from '../atoms/SelectButton';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/storeConfig';
import RootStore from '../../store/root.store';
import { useLocation } from 'react-router';
import queryString from 'query-string';
import { Text, TextType, Button } from '../atoms';

interface IProps {}

const useStyles = makeStyles(() =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    locationMeta: {
      alignSelf: 'flex-start',
    },
    showDescriptionButton: {
      alignSelf: 'baseline',
    },
  }),
);

const FilterBar: FC<IProps> = () => {
  const store: RootStore = useStore();
  const classes = useStyles();
  const onFilterChange = useCallback((value: number) => store.changeTimeFilter(value), [store]);
  const [isDescOpen, setIsDescOpen] = useState(false);

  const queryParam: string | null = useLocation().search;
  useEffect(() => {
    const filterValFromUrl: number | null = queryParam
      ? parseInt(queryString.parse(queryParam)['years_ago'] as string)
      : null;
    if (filterValFromUrl) {
      store.changeTimeFilter(filterValFromUrl);
    }
  }, [queryParam, store]);

  return (
    <div className={classes.grow}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar variant="dense">
          <Grid container spacing={2} alignItems="baseline">
            <Grid item>
              <SelectButton onChange={onFilterChange} />
            </Grid>
            <Grid item>
              <Grid item container spacing={2}>
                <Grid item className={classes.locationMeta}>
                  <Text type={TextType.CONTENT_TITLE}>{store.newsFlashWidgetsMetaString}</Text>
                </Grid>
                <Grid item className={classes.showDescriptionButton}>
                  <Button.Standard size="small" onClick={() => setIsDescOpen(!isDescOpen)}>
                    {isDescOpen ? 'הסתר פרטים' : 'הצג פרטים'}
                  </Button.Standard>
                </Grid>
              </Grid>
              <Grid item>
                <Box mt={1}>
                  {isDescOpen && (
                    <Text type={TextType.CONTENT}>
                      {store.newsFlashCollection.map((news) => {
                        if (news.id === store.activeNewsFlashId) return news.title;
                        return '';
                      })}
                    </Text>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Divider />
    </div>
  );
};

export default observer(FilterBar);
