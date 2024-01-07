<?php

namespace TDW\ACiencia\Entity;

/**
 * @Enum({ "inactive", "active" })
 */
enum Status: string {
    // status for users
    case INACTIVE = 'inactive';
    case ACTIVE = 'active';

    public const ALL_VALUES = [ 'inactive', 'active' ];
}