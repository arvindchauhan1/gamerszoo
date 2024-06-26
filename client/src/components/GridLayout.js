import { Grid, Stack } from "@mui/material";
import React from "react";

const GridLayout = (props) => {
  const { left, right } = props;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        {left}
      </Grid>
      <Grid item md={4} sx={{ display: { xs: "block", md: "block" }, margin: "0 auto", order: { xs: -1, md: "initial" } }}>
        {right}
      </Grid>
    </Grid>
  );
};

export default GridLayout;
