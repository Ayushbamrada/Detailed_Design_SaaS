const handleAddSubActivity = async (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!newSubActivity.subactivity_name.trim()) {
    dispatch(showSnackbar({
      message: "Please enter sub-activity name",
      type: "error"
    }));
    return;
  }

  let newSubs = [];

  if (newSubActivity.activityType === "single") {
    newSubs = [{
      id: `custom-sub-${Date.now()}`,
      subactivity_name: newSubActivity.subactivity_name,
      unit: newSubActivity.unit,
      activityType: newSubActivity.activityType,
      chainage_start: null,
      chainage_end: null,
      covered_area: null,
      chainage_quantity: null,
    }];
  } else {
    const start = Number(newSubActivity.chainage_start) || 0;
    const covered = Number(newSubActivity.covered_area) || 0;
    const count = Number(newSubActivity.chainage_quantity) || 0;

    if (!count || !covered || start === undefined) {
      dispatch(showSnackbar({
        message: "Enter valid Chainage Details (Start Chainage, Length, and Quantity)",
        type: "error"
      }));
      return;
    }
    let currentStart = start;

    if (newSubActivity.lengthType === 'same') {
      const covered = Number(newSubActivity.covered_area) || 0;
      if (!covered) {
        dispatch(showSnackbar({
          message: "Please enter Chainage Length",
          type: "error"
        }));
        return;
      }

      for (let i = 0; i < count; i++) {
        const currentEnd = Number((currentStart + covered).toFixed(2));
        newSubs.push({
          id: `custom-sub-${Date.now()}-${i}`,
          subactivity_name: newSubActivity.subactivity_name,
          unit: newSubActivity.unit,
          chainage_start: currentStart,
          chainage_end: currentEnd,
          covered_area: covered,
          chainage_quantity: count,
          activityType: newSubActivity.activityType,
          lengthType: 'same'
        });
        currentStart = currentEnd;
      }
    } else {
      // Different lengths
      const lengths = newSubActivity.chainageLengths;
      if (lengths.length !== count) {
        dispatch(showSnackbar({
          message: `Please enter lengths for all ${count} chainages`,
          type: "error"
        }));
        return;
      }

      for (let i = 0; i < count; i++) {
        const covered = Number(lengths[i]) || 0;
        if (!covered) {
          dispatch(showSnackbar({
            message: `Please enter valid length for chainage ${i + 1}`,
            type: "error"
          }));
          return;
        }
        const currentEnd = Number((currentStart + covered).toFixed(2));
        newSubs.push({
          id: `custom-sub-${Date.now()}-${i}`,
          subactivity_name: newSubActivity.subactivity_name,
          unit: newSubActivity.unit,
          chainage_start: currentStart,
          chainage_end: currentEnd,
          covered_area: covered,
          chainage_quantity: count,
          activityType: newSubActivity.activityType,
          lengthType: 'different',
          lengthIndex: i
        });
        currentStart = currentEnd;
      }
    }
  }

  // Rest of the function remains the same...
  const templateIndex = templatesActivities.findIndex(
    act => act.id === selectedActivityForSub
  );

  const newSubIds = newSubs.map(s => s.id);
  const lastSubId = newSubIds[newSubIds.length - 1];

  if (templateIndex !== -1) {
    setTemplateActivities(prev =>
      prev.map((act, index) => {
        if (index === templateIndex) {
          return {
            ...act,
            subActivities: [...act.subActivities, ...newSubs]
          };
        }
        return act;
      })
    );
  } else {
    setCustomActivities(prev =>
      prev.map(act => {
        if (act.id === selectedActivityForSub) {
          return {
            ...act,
            subActivities: [...act.subActivities, ...newSubs]
          };
        }
        return act;
      })
    );
  }

  // Scroll to the newly added sub-activity
  setTimeout(() => {
    const lastSubElement = document.getElementById(`sub-${lastSubId}`);
    if (lastSubElement) {
      lastSubElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);

  setNewSubActivity({
    subactivity_name: "",
    unit: "Km",
    chainage_start: '',
    covered_area: '',
    chainage_quantity: '',
    activityType: 'single',
    lengthType: 'same',
    chainageLengths: []
  });

  setShowAddSubActivityModal(false);
  setSelectedActivityForSub(null);

  dispatch(showSnackbar({
    message: "Sub-activity added successfully",
    type: "success"
  }));
};