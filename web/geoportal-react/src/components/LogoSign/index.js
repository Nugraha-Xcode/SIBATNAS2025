import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Tooltip,
  Badge,
  tooltipClasses,
  styled,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";

// Site Settings
import { retrievePublicSiteSettings } from "src/redux/actions/siteSetting";
import environment from "src/config/environment";

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        display: flex;
        text-decoration: none;
        width: 53px;
        margin: 0 auto;
        font-weight: ${theme.typography.fontWeightBold};
`
);

const LogoSignWrapper = styled(Box)(
  () => `
        width: 52px;
        height: 38px;
`
);

const LogoSign = styled(Box)(
  ({ theme }) => `
        background: ${theme.general.reactFrameworkColor};
        width: 18px;
        height: 18px;
        border-radius: ${theme.general.borderRadiusSm};
        position: relative;
        transform: rotate(45deg);
        top: 3px;
        left: 17px;

        &:after, 
        &:before {
            content: "";
            display: block;
            width: 18px;
            height: 18px;
            position: absolute;
            top: -1px;
            right: -20px;
            transform: rotate(0deg);
            border-radius: ${theme.general.borderRadiusSm};
        }

        &:before {
            background: ${theme.palette.primary.main};
            right: auto;
            left: 0;
            top: 20px;
        }

        &:after {
            background: ${theme.palette.secondary.main};
        }
`
);

const LogoSignInner = styled(Box)(
  ({ theme }) => `
        width: 16px;
        height: 16px;
        position: absolute;
        top: 12px;
        left: 12px;
        z-index: 5;
        border-radius: ${theme.general.borderRadiusSm};
        background: ${theme.header.background};
`
);

const TooltipWrapper = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.colors.alpha.trueWhite[100],
    color: theme.palette.getContrastText(theme.colors.alpha.trueWhite[100]),
    fontSize: theme.typography.pxToRem(12),
    fontWeight: "bold",
    borderRadius: theme.general.borderRadiusSm,
    boxShadow:
      "0 .2rem .8rem rgba(7,9,25,.18), 0 .08rem .15rem rgba(7,9,25,.15)",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.colors.alpha.trueWhite[100],
  },
}));

function Logo() {
  const theme = useTheme();

  // Site Settings
  const siteSetting = useSelector((state) => state.siteSetting);

  const dispatch = useDispatch();

  // Site Settings
    useEffect(() => {
      dispatch(retrievePublicSiteSettings());
    }, []);

  return (
    <TooltipWrapper title="SIBATNAS Dashboard" arrow>
      <LogoWrapper to="/">
        <Badge
          sx={{
            ".MuiBadge-badge": {
              fontSize: theme.typography.pxToRem(11),
              right: -12,
              top: 8,
            },
          }}
          overlap="circular"
          color="success"
          badgeContent="1.0"
        >
          <LogoSignWrapper>
            <img
              src={`${environment.api}site-settings/logo`}
              alt={`Logo ${siteSetting?.name || 'SIBATNAS'}`}
              width="72px"
            />
          </LogoSignWrapper>
        </Badge>
      </LogoWrapper>
    </TooltipWrapper>
  );
}

export default Logo;
