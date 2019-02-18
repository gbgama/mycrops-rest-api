const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const validateHubInput = require("../../validation/hub");

// Load Hub model
const Hub = require("../../models/Hub");
// Load User model
const User = require("../../models/User");

// @route   GET api/hubs
// @desc    Get current users hubs
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Hub.findOne({ user: req.user.id })
      .populate("user", ["name", "email"])
      .then(hub => {
        if (!hub) {
          errors.noprofile = "There is no hub for this user";
          return res.status(404).json(errors);
        }
        res.json(hub);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/hubs
// @desc    Create user hub
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateHubInput(req.body);

    // Check validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    const hubFields = {};
    hubFields.user = req.user.id;
    if (req.body.name) hubFields.name = req.body.name;
    if (req.body.updated) hubFields.updated = req.body.updated;
    if (req.body.airTemperature)
      hubFields.airTemperature = req.body.airTemperature;
    if (req.body.airHumidity) hubFields.airHumidity = req.body.airHumidity;
    // Crops
    if (typeof req.body.crops !== "undefined") {
      hubFields.crops = req.body.crops;
    }

    Hub.findOne({ user: req.user.id }).then(hub => {
      if (hub) {
        // readings
        if (req.body.readings) {
          if (hub.readings) {
            const date = new Date();

            hubFields.readings = hub.readings.concat(req.body.readings);
            hubFields.readings[hubFields.readings.length - 1].date = date;
          } else {
            const date = new Date();

            hubFields.readings = req.body.readings;

            hubFields.readings[0].date = date;
          }
        }
        // notes
        if (req.body.notes) {
          if (hub.notes) {
            hubFields.notes = hub.notes.concat(req.body.notes);
          } else {
            hubFields.notes = req.body.notes;
          }
        }
        // Update
        Hub.findOneAndUpdate(
          { user: req.user.id },
          { $set: hubFields },
          { new: true }
        ).then(hub => res.json(hub));
      } else {
        // Create

        new Hub(hubFields).save().then(hub => res.json(hub));
      }
    });
  }
);

module.exports = router;
