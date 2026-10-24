#!/system/bin/sh
# Read-only projector probe. Execute inside projector shell (without adb shell prefix).
echo "=== Maizon H713/H723 inventory (read-only) ==="
echo "SLOT: $(getprop ro.boot.slot_suffix)"
echo "SOC: $(getprop ro.boot.hardware)"
echo "ABI: $(getprop ro.product.cpu.abi)"
echo "ANDROID: $(getprop ro.build.version.release)"
echo "BUILD: $(getprop ro.build.version.incremental)"
echo "AVB device_state: $(getprop ro.boot.vbmeta.device_state)"
echo "Verified boot state: $(getprop ro.boot.verifiedbootstate)"
echo "SELinux: $(getenforce)"
echo "Kernel:"
uname -a
echo "Device Tree (model):"
tr '\000' '\n' < /proc/device-tree/model 2>/dev/null
echo "Device Tree (compatible):"
tr '\000' '\n' < /proc/device-tree/compatible 2>/dev/null
echo "Partition names (may reveal hardware config, not uploaded automatically):"
ls /dev/block/by-name 2>/dev/null
echo "=== No partitions were modified ==="
