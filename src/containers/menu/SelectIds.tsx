import { useAtom } from "jotai";
import { SelectButton } from "primereact/selectbutton";
import { selectedIdsAtom } from "@/stores";
import { AVAILABLE_IDS } from "@/constants";

export function SelectIds() {
  const [selectedIds, setSelectedIds] = useAtom(selectedIdsAtom);

  return (
    <SelectButton
      value={selectedIds}
      options={AVAILABLE_IDS.map((id) => ({
        label: id,
        value: id,
      }))}
      onChange={(e) => setSelectedIds(e.value)}
      optionLabel="label"
      multiple
    />
  );
}
