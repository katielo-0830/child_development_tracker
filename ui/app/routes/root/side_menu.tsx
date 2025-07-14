import { Link } from "react-router";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";

const drawerWidth = 280;

const menuItems = [
  { text: "Home", link: "/", icon: <HomeIcon /> },
  { text: "Sessions", link: "/sessions", icon: <EventIcon /> },
  { text: "Programs", link: "/programs", icon: <AssignmentIcon /> },
  { text: "Therapists", link: "/therapists", icon: <PersonIcon /> },
];

/*
sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#1E1E2F", // Dark background for modern look
          color: "#FFFFFF", // White text
        },
      }}

          sx={{ color: "#FFFFFF", padding: "16px" }}
          sx={{ borderColor: "#2C2C3E" }}
           sx={{ overflow: "auto" }}
*/

export default function SideMenu() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
        >
          Dashboard
        </Typography>
      </Toolbar>
      <Divider />
      <Box>
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                component={Link}
                to={item.link}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}