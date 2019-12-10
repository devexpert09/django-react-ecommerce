import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";

import { createOrder } from "../../../redux/actions/profileActions/orderActions";
import { fetchCart } from "../../../redux/actions/cartActions";
import { fetchAddresses } from "../../../redux/actions/profileActions/AddressActions";
import SelectAddress from "../SelectAddress";
import CartItemsSummary from "../../cart/CartItems";
import CartSummary from "../../cart/CartSummary";
import LoadingButton from "../../layouts/LoadingButton";

const useStyles = makeStyles(theme => ({
  mt1: {
    marginTop: theme.spacing(1)
  },
  m1: {
    margin: theme.spacing(1)
  },
  sticky: {
    marginTop: "8px",
    position: "-webkit-sticky",
    position: "sticky",
    bottom: 0
  },
  button: {
    margin: "8px",
    minWidth: "320px",
    float: "right"
  }
}));

const Order = ({ history }) => {
  const {
    cart,
    ui: { loadingUI },
    profile: { addresses }
  } = useSelector(state => state);
  const [address, setAddress] = useState(addresses[0] || "");
  const [checked, setChecked] = useState(true);
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    if (cart.items_count === 0) {
      history.push("/cart");
    }
  }, [cart.items_count]);

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    setAddress(addresses[0] || "");
  }, [addresses]);

  const handleClick = () => {
    const order = {
      reciver: {
        full_name: address.reciver_full_name,
        phone_number: address.reciver_phone_number,
        address: `${address.state} ${address.city} ${address.postal_address} ${address.postal_code}`
      },
      purchase_invoice: checked
    };
    dispatch(createOrder(order, history));
  };

  if (loadingUI === true) {
    return null;
  }

  return (
    <Grid container spacing={2}>
      <Grid item md={9}>
        <SelectAddress
          setAddress={setAddress}
          address={address}
          addresses={addresses}
        />
        <CartItemsSummary items={cart.items} />
        <Paper className={classes.mt1}>
          <FormControlLabel
            className={classes.m1}
            control={
              <Checkbox
                color="primary"
                checked={checked}
                onChange={e => setChecked(e.target.checked)}
              />
            }
            label="Send purchase invoice"
          />
        </Paper>
        <Box
          boxShadow={3}
          bgcolor="background.paper"
          className={classes.sticky}
        >
          <Button
            className={classes.m1}
            component={Link}
            to="/cart"
            variant="outlined"
          >
            Back to cart
          </Button>
          <LoadingButton
            className={classes.button}
            variant="contained"
            onClick={handleClick}
            color="primary"
          >
            Check out
          </LoadingButton>
        </Box>
      </Grid>
      <Grid item md={3}>
        <CartSummary cart={cart} />
      </Grid>
    </Grid>
  );
};

export default Order;
