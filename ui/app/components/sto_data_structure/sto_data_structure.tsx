import React, { useState } from "react";
import Box from "@mui/material/Box";
import STOTarget from "./sto_target";

interface Target {
  target: string;
  type: "count" | "response" | "steps" | null;
  id: string;
  layer?: Target[];
  steps?: string[];
}

interface STODataStructureProps {
  defaultTargets?: Target[];
  onDefaultTargetsChange?: (targets: Target[]) => void;
  formRef?: React.RefObject<HTMLFormElement> | null;
}

export default function STODataStructure({ defaultTargets=[{target: "", id: "1", type: null}], onDefaultTargetsChange, formRef }: STODataStructureProps) {
  const getMaxId = (targets: Target[]): number => {
    let maxId = 0;
    const traverse = (targets: Target[]) => {
      for (const t of targets) {
        const idNum = parseInt(t.id, 10);
        if (!isNaN(idNum) && idNum > maxId) {
          maxId = idNum;
        }
        if (t.layer && t.layer.length > 0) {
          traverse(t.layer);
        }
      }
    };
    traverse(targets);
    return maxId;
  };

  const [nextId, setNextId] = useState(() => getMaxId(defaultTargets) + 1);
  const [localTargets, setLocalTargets] = useState<Target[]>(defaultTargets);
  const [cachedTargets, setCachedTargets] = useState<Target[]>(defaultTargets);

  const getNewTarget = (): Target => {
    let id: string = String(nextId);
    setNextId(nextId + 1);
    return {
      target: "",
      id: id,
      type: null
    }
  };

  const getTargetsFromLocation = (location: number[], targets: Target[]): Target[] => {
    let nextTargets: Target[] = targets;
    let i: number = 0;
    while (i <= location.length - 1) {
      if (i === location.length - 1) {
        break;
      }
      nextTargets = nextTargets[location[i]].layer;
      i++;
    }
    return nextTargets;
  }

  const getTargetFromLocation = (location: number[], targets: Target[]): Target => {
    let nextTargets: Target[] = getTargetsFromLocation(location, targets);
    return nextTargets[location[location.length - 1]];
  };

  const handleTargetChange = (location: number[], updatedTarget: Target) => {
    let newTargets: Target[] = [...cachedTargets];
    let newTarget: Target = getTargetFromLocation(location, newTargets);
    newTarget.target = updatedTarget.target;
    newTarget.type = updatedTarget.type;
    console.log("newTarget - target change", newTargets);
    setCachedTargets(newTargets);
  };

  const handleAddLayer = (location: number[]) => {
    console.log("handleAddLayer", location);
    let newTargets: Target[] = [...cachedTargets];
    let newTarget: Target = getTargetFromLocation(location, newTargets);
    const newLayer: Target = getNewTarget();
    newTarget.layer = [newLayer];
    console.log("newTargets add layer", newTargets);
    setCachedTargets(newTargets);
    setLocalTargets(newTargets);
  };

  const handleAddTarget = (location: number[]) => {
    console.log("handleAddTarget", location);
    let newTargets: Target[] = [...cachedTargets];
    let targets: Target[] = getTargetsFromLocation(location, newTargets);
    const newTarget: Target = getNewTarget();
    targets.push(newTarget);
    console.log("newTargets add target", newTargets);
    setCachedTargets(newTargets);
    setLocalTargets(newTargets);
  }

  const handleDeleteTarget = (location: number[]) => {
    console.log("handleDeleteTarget", location);
    console.log("cachedTargets before delete", cachedTargets);
    console.log("localTargets before delete", localTargets);
    let newTargets: Target[] = [...cachedTargets];
    let targets: Target[] = getTargetsFromLocation(location, newTargets);
    targets.splice(location[location.length - 1], 1);
    console.log("newTargets delete target", newTargets);
    setCachedTargets(newTargets);
    setLocalTargets(newTargets);
    console.log("cachedTargets after delete", cachedTargets);
    console.log("localTargets after delete", localTargets);
  };

  const renderTarget = (
    target: Target,
    location: number[] = []
  ): React.ReactNode => {
    return (
      <Box key={`target-${target.id}`}>
        <STOTarget 
          target={target}
          location={location}
          onChange={(updatedTarget) => {
            handleTargetChange(location, updatedTarget);
          }}
          onAddLayer={() => {
            handleAddLayer(location);
          }}
          onAddTarget={() => {
            handleAddTarget(location);
          }}
          onDelete={() => {
            handleDeleteTarget(location);
          }}
          isFirst={location[location.length - 1] === 0}
          hasLayer={!!(target.layer && target.layer.length > 0)}
          canDelete={location.length === 1 ? localTargets.length > 1 : true}
        />
        {(
          target.layer && target.layer.length > 0 && target.layer.map((layerTarget, layerIndex) => 
            renderTarget(layerTarget, [...location, layerIndex])
          )
        )}
      </Box>
    );
  };

  return (
    <Box>
      <input type="hidden" name="targets" value={JSON.stringify(cachedTargets)} />
      {
        localTargets.map((target, index) => renderTarget(target, [index]))
      }
    </Box>
  );
}

export type { Target };