import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import { IconButton, InputAdornment } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { BuscarClienteDocumento } from "../../services/sclientes";

export const FormInputAdornment = ({ name, control, label, setCliente }) => {
  const handleBuscar = async (documento) => {
    try {
      console.log("documento ", documento);
      await BuscarClienteDocumento(documento, setCliente);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState,
      }) => (
        <TextField
          helperText={error ? error.message : null}
          size="medium"
          error={!!error}
          onChange={onChange}
          value={value}
          fullWidth
          label={label}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => handleBuscar(value)}>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};
