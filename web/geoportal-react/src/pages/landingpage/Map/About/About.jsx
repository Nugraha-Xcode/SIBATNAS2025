import {
  Button,
  Checkbox,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  styled,
} from "@mui/material";
//import styled from "styled-components";
import { useState } from "react";

export default function About() {
  const [checked, setChecked] = useState([0]);

  return (
    <Container>
      <DataContent>
        <p style={{ textAlign: "justify", marginBottom: "5px" }}>
          SIKAMBING | Frontend
        </p>
        <p style={{ textAlign: "justify", marginBottom: "5px" }}>
          Current Version: 1.0.1
        </p>
      </DataContent>
      <BottomContent>
        <BottomThree>
          <span>
            <a
              href="https://tanahair.indonesia.go.id/sikambing"
              target="_blank"
            >
              SIKAMBING
            </a>{" "}
            © 2021 @ Badan Informasi Geospasial
          </span>
        </BottomThree>
        {/*
          <BottomFour>
          <a href style={{ marginRight: "10px" }}>Term Of Use</a>
          <a href>Privacy Policy</a>
        </BottomFour>
        */}
      </BottomContent>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 80vh;
`;

const DataContent = styled.div`
  padding: 15px;
  overflow-x: hidden;
  font-size: 12px;
`;

const BottomContent = styled.div`
  padding: 15px;
  overflow-x: hidden;
  font-size: 12px;
`;

const BottomOne = styled.div`
  overflow-x: hidden;
  font-size: 12px;
  display: flex;
  flex-direction: column;
`;

const BottomTwo = styled.div`
  overflow-x: hidden;
  font-size: 12px;
  display: flex;
  flex-direction: column;
`;

const ImageList = styled.div`
  overflow-x: hidden;
  font-size: 12px;
  display: flex;
  flex-wrap: wrap;
`;

const BottomThree = styled.div`
  overflow-x: hidden;
  font-size: 12px;
`;
const BottomFour = styled.div`
  overflow-x: hidden;
  font-size: 12px;
`;
