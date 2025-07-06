const { EC2 } = require('@aws-sdk/client-ec2');
const Snapshot = require('./models/Snapshot');

// Create AWS EC2 client
const createEC2Client = (region) => {
  return new EC2({
    region: region || process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });
};

// Describe EC2 instance and get volume IDs
const getVolumeIds = async (instanceId, region) => {
  const ec2Client = createEC2Client(region);
  
  const describeInstanceParams = {
    InstanceIds: [instanceId]
  };

  try {
    const data = await ec2Client.describeInstances(describeInstanceParams);
    const reservations = data.Reservations;
    
    if (!reservations || reservations.length === 0) {
      throw new Error('No instances found with the specified ID');
    }

    const instance = reservations[0].Instances[0];
    const volumeIds = instance.BlockDeviceMappings.map(
      device => device.Ebs.VolumeId
    );

    return volumeIds;
  } catch (error) {
    console.error('Error describing instance:', error);
    throw error;
  }
};

// Create snapshot for a volume
const createVolumeSnapshot = async (volumeId, instanceId, region) => {
  const ec2Client = createEC2Client(region);
  
  const snapshotParams = {
    VolumeId: volumeId,
    Description: `Snapshot for volume ${volumeId} attached to instance ${instanceId}`,
    TagSpecifications: [{
      ResourceType: 'snapshot',
      Tags: [{
        Key: 'InstanceId',
        Value: instanceId
      }, {
        Key: 'VolumeId',
        Value: volumeId
      }]
    }]
  };

  try {
    const data = await ec2Client.createSnapshot(snapshotParams);
    return data;
  } catch (error) {
    console.error(`Error creating snapshot for volume ${volumeId}:`, error);
    throw error;
  }
};

// Main function to create snapshots
const createSnapshots = async (instanceId, region) => {
  try {
    const volumeIds = await getVolumeIds(instanceId, region);
    const snapshotResults = [];

    for (const volumeId of volumeIds) {
      const snapshotData = await createVolumeSnapshot(volumeId, instanceId, region);
      
      // Save to MongoDB
      const snapshot = new Snapshot({
        snapshotId: snapshotData.SnapshotId,
        volumeId: volumeId,
        instanceId: instanceId,
        region: region,
        timestamp: new Date(),
        status: 'completed'
      });

      await snapshot.save();
      snapshotResults.push({
        snapshotId: snapshotData.SnapshotId,
        volumeId: volumeId,
        timestamp: snapshot.timestamp,
        region: region
      });
    }

    return {
      message: 'Snapshots created successfully',
      snapshots: snapshotResults
    };
  } catch (error) {
    console.error('Error in createSnapshots:', error);
    throw error;
  }
};

// Get all snapshots
const getSnapshots = async () => {
  try {
    return await Snapshot.find().sort({ timestamp: -1 });
  } catch (error) {
    console.error('Error getting snapshots:', error);
    throw error;
  }
};

// Get snapshots by instanceId
const getSnapshotsByInstanceId = async (instanceId) => {
  try {
    return await Snapshot.find({ instanceId }).sort({ timestamp: -1 });
  } catch (error) {
    console.error('Error getting snapshots by instanceId:', error);
    throw error;
  }
};

module.exports = {
  createSnapshots,
  getSnapshots,
  getSnapshotsByInstanceId
};