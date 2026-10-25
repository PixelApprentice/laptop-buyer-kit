"""Hardware collector adapters for native OS and bootable environments."""
from .base import Collector, CommandResult, safe_exec
from .linux import LinuxCollector

__all__ = ["Collector", "CommandResult", "safe_exec", "LinuxCollector"]
